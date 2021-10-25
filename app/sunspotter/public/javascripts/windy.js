const windyBaseApiUrl = 'https://api.windy.com/api/webcams/v2/';
const windyApiKey = 'rNS6hnYbsGyVFgu4waxyMmaQW3KfMTpb';
const windyListCountry = 'list/country=';
var windyMaxWebcamLimit = 50;
var webcamMarkers = [];
const mapCenter = [46.8527,9.5306]; // Chur (CH)
var map = L.map('webcammap').setView(mapCenter, 7);

var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

openTopoMap.addTo(map);

function getWindyListCountryUrl(countrycode, limit, offset) {
    var url = windyBaseApiUrl + windyListCountry + countrycode + '/limit=' + limit + ',' + offset +'?key=' + windyApiKey + '&show=webcams:image,location';
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
        if (maxwebcams < windyMaxWebcamLimit) {
            windyMaxWebcamLimit = maxwebcams;
        }

        do {
            fetchedWebcams = await getWebcamList(countrycode, windyMaxWebcamLimit, currentWebcamOffset);
            for (var i = 0; i <fetchedWebcams.length; i++) {
                webcamlist.push(fetchedWebcams[i]);
            }
            currentWebcamOffset += windyMaxWebcamLimit;
        } while ((fetchedWebcams.length >= windyMaxWebcamLimit) && (webcamlist.length < maxwebcams))
        
        renderWebcamList(webcamlistElId, webcamlist);
    } catch (err) {
        console.error(err);
    }
}

function renderWebcamList(webcamlistElId, webcamlist) {
    var webcam;
    var html = '';
    var marker;
    
    clearMarkers(map);

    var webcamlistEl = document.getElementById(webcamlistElId);
    if (webcamlistEl !== null) {
        try {
            for (var i = 0; i < webcamlist.length; i++) {
                webcam = webcamlist[i];
                html += renderWebcamListItem(webcam);
                marker = createWebcamMapMarker(webcam, map);
                webcamMarkers.push({ webcamid: webcam.id, marker: marker, lat: webcam.location.latitude, long: webcam.location.longitude});
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
    var webcamId = webcam.id;
    var scrapeurl = `javascript:fetchPlayerImages('${webcamId}')`;
    return `<div class="webcamlist-item"> 
                <div class="webcamlist-item-header">
                    <div class="webcamlist-item-select"><input type="checkbox" id="${webcamId}" class="webcam-select" name="${webcamId}-select" onclick="onSelectWebcamClick(this)"></div>
                    <div class="webcamlist-item-title">${webcam.title}</div>
                    <div class="webcamlist-item-scrapelink"><a href="${scrapeurl}"><i class="fas fa-file-download"></i>&nbsp;Scrape</a></div>
                </div>
                <div class="webcamlist-item-content">
                    <a href="${imgurl}" alt="${webcam.title}"><div class="webcamlist-item-img"><img src="${imgurl}" /></div></a>
                    <div id="${webcamId}-playerimages" class="webcamlist-item-playerimages"></div>
                </div>
            </div>`;
  }

  function createWebcamMapMarker(webcam, map) {
    var marker;
    var tooltip;

    if (webcam.location !== undefined && webcam.location.latitude > 0 && webcam.location.longitude > 0) {
        marker = L.marker([webcam.location.latitude, webcam.location.longitude], {alt: webcam.id}).on('click', onMarkerClick).addTo(map);
        tooltip = `${webcam.title}`;
        marker.bindTooltip(tooltip);
        webcamMarkers.push({ webcamid: webcam.id, marker: marker, lat: webcam.location.latitude, long: webcam.location.longitude});
    }
    return marker;
  }

  function clearMarkers(map) {
    var marker;
    for(var i = 0; i < webcamMarkers.length; i++){
        marker = webcamMarkers[i].marker;
        map.removeLayer(marker);
    }
    webcamMarkers = [];
  }

function onMarkerClick(e) {
    const lat = e.latlng.lat;
    const long = e.latlng.lng;
    var select;
    var webcamMarker;
    var isChecked = false;

    webcamMarker = findWebcamMarkerByLatLong(lat, long);
    if (webcamMarker !== null) {
        
        select = document.getElementById(`${webcamMarker.webcamid}`);  
        if (select !== null) {
            isChecked = select.checked;
            if (isChecked) {
                webcamMarker.marker._icon.classList.remove("huechange");
                select.checked = false;
            } else {
                webcamMarker.marker._icon.classList.add("huechange");
                select.checked = true;
            }
        }
    }
}

function onSelectWebcamClick(e) {
    const elem = e;
    const elemId = elem.id;
    const webcamIdToFind = elemId;
    var webcamMarker;

    webcamMarker = findWebcamMarkerByWebcamId(webcamIdToFind)
    if (webcamMarker !== null) {
        isChecked = elem.checked;
        if (isChecked) {
            webcamMarker.marker._icon.classList.add("huechange");
        } else {
            webcamMarker.marker._icon.classList.remove("huechange");
        }
    }
}

function setAllWebcamSelect(check) {
    var webcamSelect;
    const webcamSelects = document.getElementsByClassName('webcam-select');
    for (var i = 0; i < webcamSelects.length; i++) {
        webcamSelect = webcamSelects[i];
        webcamSelect.checked = check;
        onSelectWebcamClick(webcamSelect);
    }
}

function scrapeSelected() {
    var webcamSelect;
    const webcamSelects = document.getElementsByClassName('webcam-select');
    for (var i = 0; i < webcamSelects.length; i++) {
        webcamSelect = webcamSelects[i];
        if(webcamSelect.checked) {
            fetchPlayerImages(webcamSelect.id);
        }
    }
}

function findWebcamMarkerByWebcamId(webcamId) {
    var foundWebcamMarker = null;

    for (var i = 0; i < webcamMarkers.length; i++) {
        webcamMarker = webcamMarkers[i];
        if (webcamMarker.webcamid === webcamId) {
            foundWebcamMarker = webcamMarker;
            break;
        }
    }
    return foundWebcamMarker;
  }

  function findWebcamMarkerByLatLong(lat, long) {
    var foundWebcamMarker = null;

    for (var i = 0; i < webcamMarkers.length; i++) {
        webcamMarker = webcamMarkers[i];
        if (webcamMarker.lat === lat && webcamMarker.long === long) {
            foundWebcamMarker = webcamMarker;
            break;
        }
    }
    return foundWebcamMarker;
  }

async function saveScraped() {
    var webcamPlayerImage;
    var statusLabel;
    var filename;
    var hasPermission;
    var newFileHandle;
    var webcamPlayerImages;
    var stream;
    const directoryHandle = await window.showDirectoryPicker({startIn: 'downloads'});
    const options = {};
    options.mode = 'readwrite';
    

    // Check if permission was already granted. If so, return true.
    hasPermission = (await directoryHandle.queryPermission(options) === 'granted'); 
    if (!hasPermission) {
        hasPermission = (await directoryHandle.requestPermission(options) === 'granted');
    }
    
    if (hasPermission) {
        statusLabel = document.getElementById("statusLabel");
        statusLabel.innerHTML = "Saving images...";
        webcamPlayerImages = document.getElementsByClassName('webcam-playerimage-img');
        for (var i = 0; i < webcamPlayerImages.length; i++) {
            webcamPlayerImage = webcamPlayerImages[i];
            filename = webcamPlayerImage.id;
            imgdata = webcamPlayerImage.blob;
            newFileHandle = await directoryHandle.getFileHandle(filename, { create: true });
            stream = await newFileHandle.createWritable();
            await stream.write(imgdata);
            await stream.close();
        }
        statusLabel.innerHTML = "";
        alert("Images successfully saved.");
    }
}

async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }


async function btnOpenFile() {
  // Destructure the one-element array.
  [fileHandle] = await window.showOpenFilePicker();
  // Do something with the file handle.
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
        await renderWebcamPlayerImages(`${webcamid}-playerimages`, playerImages);
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

async function renderWebcamPlayerImages(webcamlistElId, playerImages) {
    var webcam;
    var html = '';
    var imgEl;

    var webcamlistEl = document.getElementById(webcamlistElId);
    webcamlistEl.innerHTML = "";
    if (webcamlistEl !== null) {
        try {
            for (var i = 0; i < playerImages.length; i++) {
                imgEl = await renderWebcamPlayerImage(playerImages[i]);
                webcamlistEl.appendChild(imgEl);
            }
        } catch (err) {
            console.error(err);
        }
        //webcamlistEl.innerHTML = html;
    }
}

async function renderWebcamPlayerImage(imgurl) {
    var filename = imgurl.substring(imgurl.lastIndexOf('/')+1);

    const response = await fetch(imgurl);
        // get json response
    const imgblob = await response.blob();

    
    var a = document.createElement('a');
    a.target = "_blank";
    a.href = imgurl;
    var divEl = document.createElement("div");
    divEl.className = "webcam-playerimage";
    
    // Here, I use it to make an image appear on the page
    const objectURL = URL.createObjectURL(imgblob);
    const myImage = new Image();
    myImage.src = objectURL;
    myImage.id = filename;
    myImage.blob = imgblob;
    myImage.className = 'webcam-playerimage-img';
    divEl.appendChild(myImage);
    a.appendChild(divEl);

    return a;    

    //return `<a href="${imgurl}" target="_blank"><div class="webcam-playerimage"><img class="webcam-playerimage-img" id="${filename}" src="${imgurl}" /></div></a>`;
  }
