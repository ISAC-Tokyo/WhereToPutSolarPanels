(function($, global, undefined) {
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
      solarPanelType = 0;

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
      var f = global.frames[0];
      if (f && f.initialized) {
        f.setMapCenter(lat, lon);
        withGeocode && f.geocode(lat, lon, function(result) {
          if (result) {
            $('.address').text(result).show(300).removeClass('hidden');
            $(".location-result .progress").hide();
          } else {
            handleFailure()
          }
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
      location.href = './result.html?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&panelType=' + solarPanelType;
    });

    $('#btn-back').on('click', function() {
      $('.panel-selector').fadeOut(500, function() {
        $('.location-selector').fadeIn(500).removeClass('hidden');
      });
    });

    $('#solar-panel-list tr').on('click', function() {
      $('.info', $(this).parent()).removeClass('info');
      $(this).addClass('info');
      solarPanelType = $($(this)[0]).data('panel-type');
    });
  }

  function fillSolarPanelList() {
    if (global.wpsp && global.wpsp.sp) {
      var profiles = global.wpsp.sp.profiles;
      var tbody = $('#solar-panel-list > tbody');
      profiles.forEach(function(p, idx) {
        var tr = $('<tr>');
        tr.append($('<td>').text(p.name));
        tr.append($('<td class="num">').text(p.pow));
        tr.append($('<td class="num decimal">').text(p.usefulLife / 12));
        tr.append($('<td class="num">').text(p.initCost / 1000));
        tr.data('panel-type', idx);
        tbody.append(tr);
      });
    } else {
      throw "global.wpsp.sp module not found!!";
    }
  }

  function formatNumber() {
    $('.num').each(function(idx, el) {
      var num = Number($(el).text());
      if ($(el).hasClass('decimal')) {
        num = num * 10;
        num = Math.round(num);
        num = num / 10;
      }
      num = String(num);
      while (num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
      $(el).text(num);
    });
  }

  function bootstrap() {
    fillSolarPanelList();
    formatNumber();
    setupEvents();
    askLocation();
  }

  $(bootstrap);

})(jQuery, this);

