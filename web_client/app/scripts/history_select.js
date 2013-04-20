function askLocation() {
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(
        handleSuccess, 
        handleFailure, 
        {
          enableHighAccuracy:true,
          timeout: 5000
        });
  } else {
    $("#location-note").show();
  }

  function handleSuccess(pos) {
    console.log(pos);
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
  }

  function handleFailure() {
    $("#location-note-failed").show();
  }
}

function setupEvents() {
  $('#btn-location-ok').on('click', function() {
    $('.panel-selector').show();
  });

  $('#btn-panel-ok').on('click', function() {
  });
}

function bootstrap() {
  setupEvents();
  askLocation();
}

jQuery(bootstrap);
