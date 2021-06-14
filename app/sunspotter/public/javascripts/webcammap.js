const mapCenter = [46.8527,9.5306]; // Chur (CH)
var map = L.map('webcammap').setView(mapCenter, 7);

var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

openTopoMap.addTo(map);

var webcamlist;
var mapMarkers = [];

async function loadWebcamList(webcamlistElId) {
    try {
        webcamlist = await getWebcamList();
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
            clearMarkers(map);
            for (var i = 0; i < webcamlist.length; i++) {
                webcam = webcamlist[i];
                html += renderWebcamListItem(webcamlist[i]);
                createWebcamMapMarker(webcam, map);
            }
        } catch (err) {
            console.error(err);
        }
        webcamlistEl.innerHTML = html;
    }
}

async function getWebcamList() {
    var webcamlist = [];
    var url = `.`;
    
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
      webcamlist = await response.json();
    } catch(err) {
        webcamlist = [];
        console.error(err);
    }
    return webcamlist;
  }

  function renderWebcamListItem(webcam) {
    var predictionLabel = getWebcamlistPredictionLabelFromPrediction(webcam);  
    var baseUrl;
    // if a prediction is available, take the image from the prediction
    if (webcam.predictions !== undefined && webcam.predictions.length > 0) {
      prediction = webcam.predictions[0];
      baseUrl = window.location.host
      imgurl = `http://${baseUrl}/images/predicted/${prediction.imgurl}`;
    } else {
      imgurl = webcam.imgurl;
    }
    
    return `<div class="webcamlist-item"><a href="${imgurl}" alt="${webcam.title}"><div class="webcamlist-item-img"><img src="${imgurl}" /></div></a><div class="webcamlist-item-data"><div class="webcamlist-item-data-title">${webcam.title}</div><div class="webcamlist-item-data-prediction">${predictionLabel}</div><div class="webcamlist-item-data-scrapelink"><a href="./download?webcamid=${webcam.webcamid}"><i class="fas fa-file-download"></i>&nbsp;Scrape</a></div></div></div>`;
  }



  function createWebcamMapMarker(webcam, map) {
    var marker;
    var markerIcon;
    var prediction;
    var confidence;
    var tooltip;

    if (webcam.lat !== undefined && webcam.lat > 0 && webcam.long !== undefined && webcam.long > 0) {
        markerIcon = getWebcamMapMarkerIconFromPrediction(webcam);
        marker = L.marker([webcam.long, webcam.lat], {icon: markerIcon}).addTo(map);
        if (webcam.predictions !== undefined && webcam.predictions.length > 0) {
          prediction = webcam.predictions[0];
          confidence = roundOff(prediction.confidence * 100.0, 2);
          tooltip = `${webcam.title} (${confidence}%)`;
        } else {
          tooltip = `${webcam.title}`;
        }
        marker.bindTooltip(tooltip);
        mapMarkers.push(marker);
    }
    return marker;
  }

  function clearMarkers(map) {
    for(var i = 0; i < mapMarkers.length; i++){
      map.removeLayer(mapMarkers[i]);
    }
    mapMarkers = [];
  }

  var markerIconCloudy = L.divIcon({className: 'marker-icon-cloudy', html: '<i class="fas fa-cloud"></i>', iconSize: ['auto', 'auto']});
  var markerIconRainy = L.divIcon({className: 'marker-icon-rainy', html: '<i class="fas fa-cloud"></i>', iconSize: ['auto', 'auto']});
  var markerIconSunny = L.divIcon({className: 'marker-icon-sunny', html: '<i class="fas fa-sun"></i>', iconSize: ['auto', 'auto']});
  var markerIconNoPrediction = L.divIcon({className: 'marker-icon-noprediction', html: '<i class="fas fa-question-circle"></i>', iconSize: ['auto', 'auto']});

  function getWebcamMapMarkerIconFromPrediction(webcam) {
    var markerIcon;  
    var prediction;
    var predictionResult;
    
    if (webcam.predictions !== undefined && webcam.predictions.length > 0) {
      prediction = webcam.predictions[0];
      predictionResult = prediction.result;
      if (predictionResult === 0) {
            // cloudy
            markerIcon = markerIconCloudy;
        } else if (predictionResult === 1) {
            // rainy
            markerIcon = markerIconRainy;
        } else if (predictionResult === 2) {
          // sunny
          markerIcon = markerIconSunny;
        }else {
            // unknown prediction type
            markerIcon = markerIconSunny;
        }
      } else {
        markerIcon = markerIconNoPrediction;
      }
      return markerIcon;
  }

  function getWebcamlistPredictionLabelFromPrediction(webcam) {
    var label;
    var labelNoprediction = '<div class="prediction-label prediction-label-noprediction"><i class="fas fa-question-circle"></i>&nbsp;Not predicted</div>';
    var prediction;
    var predictionResult;

    if (webcam.predictions !== undefined && webcam.predictions.length > 0) 
    {
      prediction = webcam.predictions[0];
      predictionResult = prediction.result;
      confidence = roundOff(prediction.confidence * 100.0, 2);
      timestamp = formatDateTimeStr(prediction.timestamp);
      if (predictionResult === 0) {
          // cloudy
          label = `<div class="prediction-label prediction-label-cloudy"><i class="fas fa-cloud"></i>&nbsp;Cloudy&nbsp;(${confidence}%),&nbsp;${timestamp}</div>`;
      } else if (predictionResult === 1) {
          // rainy
          label = `<div class="prediction-label prediction-label-rainy"><i class="fas fa-cloud-showers-heavy"></i>&nbsp;Rainy&nbsp;(${confidence}%),&nbsp;${timestamp}</div>`;
      } else if (predictionResult === 2) {
          // sunny
          label = `<div class="prediction-label prediction-label-sunny"><i class="fas fa-sun"></i>&nbsp;Sunny&nbsp;(${confidence}%),&nbsp;${timestamp}</div>`;
      } else {
          // unknown prediction type
          label = labelNoprediction;
      }
    } else {
      label = labelNoprediction;
    }
    return label;
  }


  async function initWebcams() {
    var webcamlist = [];
    var url = `./init`;
    
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
      webcamlist = await response.json();
      if (webcamlist.error === undefined) {
        renderWebcamList('webcamlist', webcamlist);
      } else {
        throw webcamlist.error;
      }
    } catch(err) {
        webcamlist = [];
        console.error(err);
        alert(err);
    }
    return webcamlist;
  }

  async function geocodeAllWebcams() {
    var webcamlist = [];
    var url;
    var chkUseGeocodeService; 
    var useGeocodeService = false;
    
    // read checkbox use geocode service state
    chkUseGeocodeService = document.getElementById("chkUseGeocodeService")
    if (chkUseGeocodeService !== null) {
      useGeocodeService = chkUseGeocodeService.checked;
    }
    url = `./geocode?useGeocodeService=${useGeocodeService}`;

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
      webcamlist = await response.json();
      if (webcamlist.error === undefined) {
        renderWebcamList('webcamlist', webcamlist);
      } else {
        throw webcamlist.error;
      }
    } catch(err) {
        webcamlist = [];
        console.error(err);
        alert(err);
    }
    return webcamlist;
  }

  async function predictAllWebcams() {
    var webcamlist = [];
    var url = `./predictall`;
    
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
      webcamlist = await response.json();
      if (webcamlist.error === undefined) {
        renderWebcamList('webcamlist', webcamlist);
      } else {
        throw webcamlist.error;
      }
    } catch(err) {
        webcamlist = [];
        console.error(err);
        alert(err);
    }
    return webcamlist;
  }

  function roundOff(num, places) 
  {
    const x = Math.pow(10,places);
    return Math.round(num * x) / x;
  }

  function formatDateTimeStr(datetimeStr) {
    var newDatetimeStr = "";
    var dateTime = new Date(datetimeStr);

    var fullYear = dateTime.getFullYear();
    var month = dateTime.getMonth(); // month starts at 0
    month ++;
    var day = dateTime.getDate();
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var seconds = dateTime.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }
  
    if (day < 10) {
      day = '0' + day;
    }
    
    if (hours < 10) {
      hours = '0' + hours;
    }
    
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    newDatetimeStr = `${day}.${month}.${fullYear} ${hours}:${minutes}:${seconds}`;
    return newDatetimeStr
  }

 loadWebcamList('webcamlist');