(function($, undefined) {
  'use strict';

  var map,
      // User location
      pos = {
        coords: {
          latitude: 35.6606707,
          longitude: 139.6775398
        }
      },
      // Selected type
      solerPanelType = 0;

  function askLocation() {
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(
          handleSuccess, 
          handleFailure, 
          {
            enableHighAccuracy: true,
            timeout: 10000
          });
    } else {
      $("#location-note").show(500).removeClass('hidden');
      $(".location-result .progress").hide();
    }

    function handleSuccess(_pos) {
      pos = _pos;
      updateMap(_pos.coords.latitude, _pos.coords.longitude, true);
    }

    function updateMap(lat, lon, withGeocode) {
      var f = window.frames[0];
      if (f && f.initialized) {
        f.setMapCenter(lat, lon);
        withGeocode && f.geocode(lat, lon, function(result) {
          $('.address').text(result + 'に設置します。').show(300).removeClass('hidden');
          $(".location-result .progress").hide();
        });


      } else {
        setTimeout(function() {
          handleSuccess(_pos);
        }, 500);
      }
    }

    function handleFailure() {
      $("#location-note-failed").show(500).removeClass('hidden');
      $(".location-result .progress").hide();
      updateMap(pos.coords.latitude, pos.coords.longitude); // Use initial pos
    }
  }

  function setupEvents() {
    $('#btn-location-ok').on('click', function() {
      $('.location-selector').fadeOut(500, function() {
        $('.panel-selector').fadeIn(500).removeClass('hidden');
      });
    });

    $('#btn-panel-ok').on('click', function() {
      location.href = './result.html?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&panelType=' + solerPanelType;
    });

    $('#btn-back').on('click', function() {
      $('.panel-selector').fadeOut(500, function() {
        $('.location-selector').fadeIn(500).removeClass('hidden');
      });
    });

 
  }

  function bootstrap() {
    setupEvents();
    askLocation();
  }

  $(bootstrap);

})(jQuery);

