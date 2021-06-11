var express = require('express');
var fs = require('fs');
var fetch = require('node-fetch');
var sqlite = require("../db/aa-sqlite");
var dbwebcam = require('../db/webcam');
var dbprediction = require('../db/prediction');
var jsdom = require("jsdom");
var tf = require('@tensorflow/tfjs');
var tfnode = require('@tensorflow/tfjs-node');

const { urlencoded, json } = require('express');
const { JSDOM } = jsdom;
var router = express.Router();

/* GET webcam list. */
router.get('/', async function(req, res, next) {
  var allwebcams;
  var webcamObj;
  var latlong;
  try {
    webcams = await dbwebcam.getAll();
    res.send(webcams);
  } catch(err) {
    res.send('Error during webcam.getAll: ' + err);
  }
});

/* GET webcam download page. */
router.get('/download', function(req, res, next) {
  res.render('webcam', { title: 'Download webcam images', downloadurl: './download' });
});

/* POST download images from webcam */
router.post('/download', function(req, res, next) {

  const datetimefrom = req.body.datetimefrom;
  const datetimeto = req.body.datetimeto;
  const timeinterval = req.body.timeinterval;
  const webcamurl = req.body.webcamurl;
  const webcamid = req.body.webcamid;

  if (datetimefrom !== '' && datetimeto != '' && webcamurl !== '') {
    var dateTimeFrom = new Date(datetimefrom);
    var dateTimeTo = new Date(datetimeto);
    var timeInterval = parseInt(timeinterval);
    var images = buildDownloadImages(webcamid, webcamurl, dateTimeFrom, dateTimeTo, timeInterval);
    if (images.length > 0) {
      for (var i = 0; i < images.length; i++) {
        downloadImage(images[i], `./downloads/${webcamid}/`);
      }
    }

    res.send(images);
  } else {
    res.send('respond with a resource');
  }
});

/* GET webcam map page. */
router.get('/map', function(req, res, next) {
  res.render('webcammap', { title: 'Webcam overview' });
});

/* init webcam database */
router.get('/init', async function(req, res, next) {
  var webcamlist;
  var latlong;
  try {
    
    await dbwebcam.init();

    webcamlist = await getWebcamListFromFotoWebcamEu();
    for (var i = 0; i < webcamlist.length; i++) {
      await dbwebcam.insert(i, webcamlist[i].webcamid, webcamlist[i].title, 0.0, 0.0, webcamlist[i].imgurl);
    }

    //sqlite.close();
    res.send(webcamlist);
  } catch(err) {
    res.send('Error during initializing database: ' + err);
  }
});

/* init webcam database */
router.get('/geocode', async function(req, res, next) {
  var allwebcams;
  var webcamObj;
  var latlong;
  var useGeocodeService;

  useGeocodeService = (req.query.useGeocodeService.toLowerCase() === 'true');

  try {
    allwebcams = await dbwebcam.getAllWhereTitleIsSetAndNotGeocoded();
    for(var i = 0; i < allwebcams.length; i++) {
      webcamObj = allwebcams[i];
      console.log("Get LatLong for webcam:", webcamObj.ID, webcamObj.title);
      
      if (useGeocodeService) {
        latlong = await getWebcamLatLong(webcamObj.title, webcamObj.webcamid); 
      } else {
        latlong = await getWebcamLatLongFromCache(webcamObj.title, webcamObj.webcamid);
        if (latlong === null) {
          latlong = await getWebcamLatLong(webcamObj.title, webcamObj.webcamid); 
        }
      }
      
      if (latlong != null) {
        await dbwebcam.updateLatLong(webcamObj.ID, latlong.lat, latlong.long);
      } 
    }
    res.send(`Gecoded webcam positions for ${allwebcams.length} webcams.`);
  } catch(err) {
    res.send('Error during geocode webcam positions: ' + err);
  }
});

/* init webcam database */
router.get('/predictall', async function(req, res, next) {
  var allwebcams;
  var webcamObj;
  var webcamid;
  var webcamImage;
  var webcamImageFile;
  var prediction;
  var modelType;
  var backInTimeOffesetInMinutes = 15; 
  var urlTemplate = `https://www.foto-webcam.eu/webcam/%webcamid/%YYYY/%mm/%dd/%HH%MM_la.jpg`;
  var dateTime = new Date();
  
  var model;
  const resnet_v2_50 = await tf.loadLayersModel('http://localhost:3000/tf/resnet_v2_50.json');

  if (modelType === 'resnet_v2_50') {
    model = resnet_v2_50;
  } else {
    model = resnet_v2_50;
  }

  modelType = req.query.mt.toLowerCase();
  dateTime.setMinutes(dateTime.getMinutes() - backInTimeOffesetInMinutes);

  try {
    // initialize prediction
    dbprediction.init();
    
    allwebcams = await dbwebcam.getAll();
    for(var i = 0; i < allwebcams.length; i++) {
      webcamObj = allwebcams[i];
      console.log("Do prediction for webcam:", webcamObj.ID, webcamObj.title);
      webcamid = webcamObj.webcamid;
      webcamImage = buildWebcamImage(webcamid, urlTemplate, dateTime)
      webcamImageFile = downloadImage(webcamImage, `./predicted/${webcamid}-`);
      if (webcamImageFile !== "") {
        prediction = await predictWebcam(webcamid, webcamImageFile, model);
        if (prediction !== null) {
          dbprediction.insert(i, fkwebcam, prediction.result, webcamImageFile, dateTime);
        } else {
          console.log(`Prediction of ${webcamImageFile} (webcamid: ${webcamid}) failed. No prediction result`);
        }
      } else {
        console.log(`Can't make webcam prediction for the webcam (webcamid: ${webcamid})`);
      }
    }
    res.send(allwebcams);
  } catch(err) {
    res.send(`Error during predict webcam (webcamid: ${webcamid}): ` + err);
  }
});

async function predictWebcam(webcamid, webcamImageFile, model) {
  var tfImage;
  var prediction;

  try 
  {
    tfImage = getTfImage(webcamImageFile);
    prediction = model.predict(tfImage);
  } catch(err) {
    console.log(`Error predicting image: ${webcamImageFile}`);
  }
  return prediction;
}

function getTfImage(imagefilename)
{
  var imageBuffer;
  var tfImage = null;

  try 
  {
    imageBuffer = fs.readFileSync(imagefilename);
    tfimage = tfnode.node.decodeImage(imageBuffer);
  } catch(err) {
    console.error(err);
    tfImage = null;
  }
  return tfImage;
}

/* get webcam list either from cache or scrape directly from website */
router.get('/list', async function(req, res, next) {
  var webcamlist;
  const fromcache = req.fromcache;
  
  if (fromcache !== undefined && fromcache !== '') {
    webcamlist = await getWebcamListFromCache();
  } else {
    webcamlist = await getWebcamListFromFotoWebcamEu();
  }
  res.send(webcamlist);
});

async function getWebcamLatLong(title, webcamid) {
  var point = null;
  var urlencodedTitle = encodeURIComponent(title);
  var apikey = '5b3ce3597851110001cf62481cd8cf137a244c0da87f7abaab6cfc9f';
  var boundingboxCentralEurope = '&boundary.rect.min_lat=4.59&boundary.rect.min_lon=44.16&boundary.rect.max_lat=18.66&boundary.rect.max_lon=50.16'

  var urlWithBB = `https://api.openrouteservice.org/geocode/search?api_key=${apikey}&text=${urlencodedTitle}&size=1${boundingboxCentralEurope}`;
  var url = `https://api.openrouteservice.org/geocode/search?api_key=${apikey}&text=${urlencodedTitle}&size=1`;
  var filename;
  var jsonObjAsString;

  try {
    // geocode the webcam position
    var fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      }
    }
    const response = await fetch(url, fetchOptions);
    // get json response
    const jsonObj = await response.json();

    if (jsonObj.error === undefined) {
      // response from gecode service doesn't contain an error
      try {
        jsonObjAsString = JSON.stringify(jsonObj);
        filename = `./geocode-cache/${webcamid}.json`;
        fs.writeFileSync(filename, jsonObjAsString);
        console.log(`Gecode response saved for webcam: ${webcamid} in ${filename}`);
      } catch (err) {
          console.error(err);
      }
  
      // try to get the point
      point = getPoint(jsonObj);
    } 
  } catch(err) {
    console.error(err);
  }
  return point;
}

async function getWebcamLatLongFromCache(title, webcamid) {
  var point = null;
  var jsonObj;
  var filename;
  var jsonAsString;

  try {
    filename = `./geocode-cache/${webcamid}.json`;
    jsonAsString = fs.readFileSync(filename, { encoding: 'utf-8' });
    jsonObj = JSON.parse(jsonAsString);
    console.log(`Read LatLong for webcam: ${webcamid} from cache ${filename}`);
    // try to get the point
    point = getPoint(jsonObj);
  } catch(err) {
    console.error(err);
  }
  return point;
}

function getPoint(jsonObj) {
  var firstFeature;
  var point = null;
  if (jsonObj.features !== undefined && jsonObj.features.length > 0) {
    firstFeature = jsonObj.features[0];
    if (firstFeature.geometry !== undefined && firstFeature.geometry.type === 'Point') {
      point = { lat: firstFeature.geometry.coordinates[0], long: firstFeature.geometry.coordinates[1] };
    }
  }
  return point;
}

function buildDownloadImages(webcamid, urlTemplate, dateTimeFrom, dateTimeTo, timeInterval) {
  var images = [];
  var url;
  var dateTime = dateTimeFrom;

  do {
    image = buildWebcamImage(webcamid, urlTemplate, dateTime);
    dateTime.setHours(dateTime.getHours() + timeInterval);
    images.push(image);
  } while (dateTime < dateTimeTo);
  return images;
}

function buildWebcamImage(webcamid, urlTemplate, dateTime) {
  /* e.g. 
    https://www.foto-webcam.eu/webcam/innsbruck-uni-west/2020/12/30/1200_la.jpg
    https://www.foto-webcam.eu/webcam/%webcamid/%YYYY/%mm/%dd/%HH%MM_la.jpg
  */ 
  var fullYear = dateTime.getFullYear();
  var month = dateTime.getMonth(); // month starts at 0
  month ++;
  var day = dateTime.getDate();
  var hours = dateTime.getHours();
  var minutes = dateTime.getMinutes();
  var seconds = dateTime.getSeconds();

  var url = urlTemplate;
  url = url.replace('%YYYY', fullYear);
  if (month < 10) {
    month = '0' + month;
  }
  url = url.replace('%mm', month);
  if (day < 10) {
    day = '0' + day;
  }
  url = url.replace('%dd', day);
  if (hours < 10) {
    hours = '0' + hours;
  }
  url = url.replace('%HH', hours);
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  url = url.replace('%MM', minutes);
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  url = url.replace('%ss', seconds);
  url = url.replace('%webcamid', webcamid);

  filename = webcamid + '-' + fullYear + '-' + month + '-' + day + '_' + hours + '-' + minutes + '-' + seconds;
  filename = filename + '.' + url.substr(url.lastIndexOf('.') + 1);
  return { url: url, filename: filename };
}

function buildWebcamImageUrl(webcamid, urlTemplate)
{
  /* e.g. 
    https://www.foto-webcam.eu/webcam/innsbruck-uni-west/current/180.jpg
    https://www.foto-webcam.eu/webcam/%webcamid/%YYYY/%mm/%dd/%HH%MM_la.jpg
  */ 
  var url = urlTemplate.replace('%webcamid', webcamid);
  return url;
}

function buildWebcamTitle(title) {
  var newTitle;
  const posDash = title.indexOf('-');
  if (posDash > 0) {
    newTitle = title.substr(0, posDash);
  } else {
    newTitle = title;
  }
  newTitle = newTitle.trim();
  return newTitle;
}

function buildWebcamId(webcamIdWithUrl) {
  var webcamid;
  
  webcamid = webcamIdWithUrl.replace('webcam', '');
  webcamid = webcamid.replaceAll('/', '');
  return webcamid;
}

async function downloadImage(image, pathToSave) {
  const response = await fetch(image.url);
  const buffer = await response.buffer();
  const dirExists = fs.existsSync(pathToSave);
  var filename;
  try {

    if (!dirExists) {
      await makefolder(pathToSave);
    }
    filename = `${pathToSave}${image.filename}`;
    fs.writeFileSync(filename, buffer);
  } 
  catch(err)
  {
    console.error(err);
    filename = "";
  }
  return filename;
}

function makefolder (folder) {
  return new Promise(function (resolve, reject) {
   fs.mkdir(folder, function (err) {
    if (err) return reject(err)
    resolve()
   })
  })
 }

async function getWebcamListFromFotoWebcamEu(webcamlisturl, cssClassname) {
  var webcamlist = [];
  var webcam;
  var imgurl;
  var webcamlisturl = 'https://www.foto-webcam.eu';
  var imgurlTempl = 'https://www.foto-webcam.eu/webcam/%webcamid/current/180.jpg';
  var cssClassnameOfWecamElem = '.wcov';
  var now = new Date();

  try {
    // get the website
    const response = await fetch(webcamlisturl);
    // get the html content
    const htmlString = await response.text();
    // instantiate DOM parser
    const { document } = (new JSDOM(htmlString)).window;
    const arrOfElems = document.querySelectorAll(cssClassnameOfWecamElem);
    for (var i = 0; i < arrOfElems.length; i++) {
      webcamEl = arrOfElems[i]; 
      title = buildWebcamTitle(webcamEl.title);
      webcamid = buildWebcamId(webcamEl.href);
      imgurl = buildWebcamImageUrl(webcamid, imgurlTempl);
      webcam = { title: title, webcamid: webcamid, imgurl: imgurl };
      webcamlist.push(webcam);
    }
  } catch(err) {
    console.error(err);
  }
  return webcamlist;
}

async function getWebcamListFromCache() {
  return [];
}



module.exports = router;
