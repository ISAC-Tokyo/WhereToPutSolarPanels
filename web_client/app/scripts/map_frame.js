'use strict';

var initialized = window.initialized = false;

(function() {
  'use strict';

  var myMap = null;
  var geocoder = null;

  function initializeMap() {
    var initLat = 35.6606707;
    var initLon = 139.6775398;

    var myLatlng = new google.maps.LatLng(initLat, initLon);
    var mapOptions = {
      zoom: 12,
      center: myLatlng,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    myMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();
    window.initialized = true;
  }

  function geocode(lat, lng, callback) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              callback(results[1].formatted_address);
            } else {
              callback(results[0].formatted_address);
            }
          } else {
            alert("Geocoder failed due to: " + status);
          }
        });
  }

  function setMapCenter(lat, lng) {
    var centerPos = new google.maps.LatLng(lat, lng);

    var marker = new google.maps.Marker({
      position: centerPos,
      map: myMap,
      draggable:true,
      animation: google.maps.Animation.DROP,
      title: "Hello World!"
    });

    myMap.setCenter(centerPos);
  }
  google.maps.event.addDomListener(window, 'load', initializeMap);

  window.setMapCenter = setMapCenter;
  window.geocode = geocode;
})();

