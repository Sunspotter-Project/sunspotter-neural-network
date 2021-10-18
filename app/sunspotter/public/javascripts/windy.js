const windyBaseApiUrl = 'https://api.windy.com/api/webcams/v2/';
const windyApiKey = 'rNS6hnYbsGyVFgu4waxyMmaQW3KfMTpb';
const windyListCountry = 'list/country=';
const windyMaxWebcamLimit = 50;

function getWindyListCountryUrl(countrycode, limit, offset) {
    var url = windyBaseApiUrl + windyListCountry + countrycode + '/limit=' + limit + ',' + offset +'?key=' + windyApiKey + '&show=webcams:image';
    return url;
}

async function getWebcamList(country, limit, offset) {
    var webcamlist = [];
    var url = getWindyListCountryUrl(country, limit, offset);
    
    try {
      // geocode the webcam position
      var fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
      const response = await fetch(url, fetchOptions);
      // get json response
      const json = await response.json();
      if (json.status === 'OK') {
        webcamlist = json.result.webcams;
      }
    } catch(err) {
        webcamlist = [];
        console.error(err);
    }
    return webcamlist;
  }

  async function loadWebcamList(webcamlistElId) {
    var currentWebcamOffset = 0;
    var fetchedWebcams = [];
    var webcamlist = [];
    try {
        // get selected country code
        var sel = document.getElementById("countrycode");
        var countrycode = sel.options[sel.selectedIndex].value;

        // get max webcams
        var maxwebcamsEl = document.getElementById("maxwebcams");
        var maxwebcams = maxwebcamsEl.value;
        
        do {
            fetchedWebcams = await getWebcamList(countrycode, windyMaxWebcamLimit, currentWebcamOffset);
            for (var i = 0; i <fetchedWebcams.length; i++) {
                webcamlist.push(fetchedWebcams[i]);
            }
            currentWebcamOffset += windyMaxWebcamLimit;
        } while ((fetchedWebcams.length >= windyMaxWebcamLimit) && (maxwebcams < webcamlist.length))
        
        renderWebcamList(webcamlistElId, webcamlist);
    } catch (err) {
        console.error(err);
    }
}

function renderWebcamList(webcamlistElId, webcamlist) {
    var webcam;
    var html = '';

    var webcamlistEl = document.getElementById(webcamlistElId);
    if (webcamlistEl !== null) {
        try {
            for (var i = 0; i < webcamlist.length; i++) {
                webcam = webcamlist[i];
                html += renderWebcamListItem(webcamlist[i]);
            }
        } catch (err) {
            console.error(err);
        }
        webcamlistEl.innerHTML = html;
    }
}

function renderWebcamListItem(webcam) {
    var imgurl = webcam.image.current.thumbnail;

    // get selected timeinterval
    var sel = document.getElementById("timeinterval");
    var timeinterval = sel.options[sel.selectedIndex].value;
    var scrapeurl = `javascript:fetchPlayerImages('${webcam.id}')`;
    return `<div class="webcamlist-item"><a href="${imgurl}" alt="${webcam.title}"><div class="webcamlist-item-img"><img src="${imgurl}" /></div></a><div class="webcamlist-item-data"><div class="webcamlist-item-data-title">${webcam.title}</div><div class="webcamlist-item-data-scrapelink"><a href="${scrapeurl}"><i class="fas fa-file-download"></i>&nbsp;Scrape</a></div></div></div>`;
  }


async function fetchPlayerImages(webcamid) {

    var sel = document.getElementById("timeinterval");
    var timeinterval = sel.options[sel.selectedIndex].value;

    var url = 'https://webcams.windy.com/webcams/public/embed/player/' + webcamid + '/' + timeinterval;
    var scriptText = '';
    var playerImages;
    try {
        // geocode the webcam position
        var fetchOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        }
        const response = await fetch(url, fetchOptions);
        // get json response
        scriptText = await response.text();
        playerImages = parsePlayerScript(scriptText);
        renderWebcamPlayerImages('webcammap', playerImages);
      } catch(err) {
        playerImages = [];
        console.error(err);
      }
      return playerImages;
    }

function parsePlayerScript(scriptText) {

    /*
    _slideFull = ['https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634537057.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634540702.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634544379.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634548053.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634551759.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634555420.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634559087.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634562796.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634566545.jpg','https://archive-webcams.windy.com/52/1000550952/day/full/1000550952@1634570294.jpg','https://images-webcams.windy.com/52/1000550952/current/full/1000550952.jpg'],
    _slideNormal = ['https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634537057.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634540702.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634544379.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634548053.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634551759.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634555420.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634559087.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634562796.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634566545.jpg','https://archive-webcams.windy.com/52/1000550952/day/normal/1000550952@1634570294.jpg','https://images-webcams.windy.com/52/1000550952/current/normal/1000550952.jpg'],
    _slidePreview = ['https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634537057.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634540702.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634544379.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634548053.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634551759.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634555420.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634559087.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634562796.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634566545.jpg','https://archive-webcams.windy.com/52/1000550952/day/preview/1000550952@1634570294.jpg','https://images-webcams.windy.com/52/1000550952/current/preview/1000550952.jpg'],
    */

    var keyword = '_slideNormal = [';

    var startPos = scriptText.indexOf(keyword);
    var endPos = 0;
    if (startPos > 0) {
        endPos = scriptText.indexOf(']', startPos);
    }
    var slides = scriptText.substring(startPos + keyword.length, endPos);
    slides = slides.replaceAll('\'', "");
    allSlides = slides.split(',');
    return allSlides;
}

function renderWebcamPlayerImages(webcamlistElId, playerImages) {
    var webcam;
    var html = '';

    var webcamlistEl = document.getElementById(webcamlistElId);
    if (webcamlistEl !== null) {
        try {
            for (var i = 0; i < playerImages.length; i++) {
                html += renderWebcamPlayerImage(playerImages[i]);
            }
        } catch (err) {
            console.error(err);
        }
        webcamlistEl.innerHTML = html;
    }
}

function renderWebcamPlayerImage(imgurl) {
    return `<div class="webcamlist-item-img"><img src="${imgurl}" /></div>`;
  }
