const mapCenter = [46.8527,9.5306]; // Chur (CH)
var map = L.map('webcammap').setView(mapCenter, 7);

var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

openTopoMap.addTo(map);

/*
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
    }).addTo(map);
    */

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
    
    return `<div class="webcamlist-item"><div class="webcamlist-item-img"><img src="${imgurl}" /></div><div class="webcamlist-item-data"><div class="webcamlist-item-data-title">${webcam.title}</div><div class="webcamlist-item-data-prediction">${predictionLabel}</div></div></div>`;
  }



  function createWebcamMapMarker(webcam, map) {
    var marker;
    var markerIcon;  
    if (webcam.lat !== undefined && webcam.lat > 0 && webcam.long !== undefined && webcam.long > 0) {
        markerIcon = getWebcamMapMarkerIconFromPrediction(webcam);
        marker = L.marker([webcam.long, webcam.lat], {icon: markerIcon}).addTo(map);
        marker.bindTooltip(webcam.title);
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

  var markerIconSunny = L.divIcon({className: 'marker-icon-sunny', html: '<i class="fas fa-sun"></i>', iconSize: ['auto', 'auto']});
  var markerIconCloudy = L.divIcon({className: 'marker-icon-cloudy', html: '<i class="fas fa-cloud"></i>', iconSize: ['auto', 'auto']});
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
            // sunny
            markerIcon = markerIconSunny;
        } else {
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
    var labelSunny = '<div class="prediction-label prediction-label-sunny"><i class="fas fa-sun"></i>&nbsp;Sunny</div>';
    var labelCloudy = '<div class="prediction-label prediction-label-cloudy"><i class="fas fa-cloud"></i>&nbsp;Cloudy</div>';
    var labelNoprediction = '<div class="prediction-label prediction-label-noprediction"><i class="fas fa-question-circle"></i>&nbsp;Not predicted</div>';
    var prediction;
    var predictionResult;

    if (webcam.predictions !== undefined && webcam.predictions.length > 0) 
    {
      prediction = webcam.predictions[0];
      predictionResult = prediction.result;
      if (predictionResult === 0) {
          // cloudy
          label = `<div class="prediction-label prediction-label-cloudy"><i class="fas fa-cloud"></i>&nbsp;Cloudy, &nbsp;${prediction.timestamp}</div>`;
      } else if (predictionResult === 1) {
          // sunny
          label = `<div class="prediction-label prediction-label-sunny"><i class="fas fa-sun"></i>&nbsp;Sunny,&nbsp;${prediction.timestamp}</div>`;
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
      renderWebcamList('webcamlist', webcamlist);
    } catch(err) {
        webcamlist = [];
        console.error(err);
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
      renderWebcamList('webcamlist', webcamlist);
    } catch(err) {
        webcamlist = [];
        console.error(err);
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

 loadWebcamList('webcamlist');