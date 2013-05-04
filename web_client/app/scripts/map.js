/**
 */
var wpsp = wpsp || {};

/**
 * Map
 */
wpsp.map = wpsp.map || function() {
  this.root = {};
  this.dataServer = window.location.protocol + "//" + window.location.host;
  this.panes = {};
  this.heatMapCache = {};
};

wpsp.map.prototype.buildMap = function(options) {
  return new google.maps.Map(document.getElementById("map"), options || {});
};

wpsp.map.prototype.init = function() {
  var mapOptions = {
    center: new google.maps.LatLng(35.632291, 139.881371), // Tokyo Disney Land
    zoom: 10,
    maxZoom: 12,
    minZoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    },
    streetViewControl: false
  };
  var map = this.buildMap(mapOptions);

  var me = this;
  var updateMap = function() {
    var targetURL = me.dataServer + "/api/v1/rank/range";
    var northEast = this.getBounds().getNorthEast();
    var southWest = this.getBounds().getSouthWest();
    var data = {
      lon_r: [ southWest.lng(), northEast.lng() ],
      lat_r: [ southWest.lat(), northEast.lat() ],
    };
    if (me.dataServer != (window.location.protocol + "//" + window.location.host)) {
      $.ajax(targetURL, {
        data: data,
        dataType: "jsonp",
        success: function(data) {
          me.buildHeatMapLayer(data);
        }
      });
    } else {
      $.ajax(targetURL, {
        data: data,
        dataType: "json",
        timeout: 5,
        success: function(data, textStatus, jqXHR) {
          me.buildHeatMapLayer(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert("failed to update heat map data!");
        }
      });
    }
  };
  google.maps.event.addListenerOnce(map, 'center_changed', updateMap);
  google.maps.event.addListener(map, 'dragend', updateMap);
  google.maps.event.addListener(map, 'zoom_changed', updateMap);

  this.root = map;
};

/**
 * Layers.
 */
wpsp.map.prototype.buildHeatMapLayer = function(data) {
  var me = this;
  if (this.heatMap) {
    me.heatMap.setMap(null);
  }
  var zoom = "" + me.root.getZoom();
  var center = "(" + me.root.getCenter().lat() + "," + me.root.getCenter().lng() + ")";
  var dataSet = [];
  if (me.heatMapCache[zoom] == undefined || me.heatMapCache[zoom][center] == undefined) {
    $(data).each(function(idx, d) {
      dataSet.push({
        location: new google.maps.LatLng(d.lat, d.lon),
        weight:   d.weight
      });
    });
  }

  if (me.heatMapCache[zoom] == undefined) {
    me.heatMapCache[zoom] = {};
  }

  if (me.heatMapCache[zoom][center] == undefined) {
    var heatmap = undefined;
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: dataSet
    });
    var gradient = [
      'rgba(0, 0, 255, 1)',
      'rgba(0, 255, 0, 1)',
      'rgba(255, 255, 0, 1)',
      'rgba(255, 0, 0, 1)'
    ]

    var radiusForScale = {
      12: 5,
      11: 9,
      10: 11,
      9: 21,
      8: 38,
      7: 80,
      6: 120,
      5: 240
    };

    heatmap.setOptions({
      dissipating: true,
      radius: $("#map").width() / radiusForScale[this.root.zoom],
      gradient: heatmap.get('gradient') ? null : gradient
    });
    me.heatMapCache[zoom][center] = heatmap;
  } else {
    heatmap = me.heatMapCache[zoom][center];
  }
  heatmap.setMap(this.root);
  me.heatMap = heatmap;
};

/**
 * Pane management.
 */
wpsp.map.prototype.registerPane = function(name, position, pane) {
  if (this.panes[name] == undefined) {
    this.panes[name] = pane;
    this.root.controls[position].push(pane);
  }
};

wpsp.map.prototype.deRegisterPane = function(name) {
  delete this.panes[name];
};

wpsp.map.prototype.makeItemizedPane = function(name, contentList, extraClass) {
  var pane = document.createElement("div");
  pane.id = name + "-pane";
  $(pane).addClass("map-pane");
  if (extraClass != undefined) {
    $(pane).addClass(extraClass);
  }
  for (var i = 0; i < contentList.length; i++) {
    var contentDiv = document.createElement("div");
    $(contentDiv).addClass("map-pane-item");
    var itemExtraClass = contentList[i].itemExtraClass;
    if (itemExtraClass) {
      $.each(itemExtraClass, function(i, c) {
        $(contentDiv).addClass(c);
      });
    }
    var content = new wpsp.map.ItemizedPaneItem();
    content.title = contentList[i].title;
    content.action = contentList[i].action;
    var title = document.createElement("div");
    title.innerHTML = content.title;
    var image = document.createElement("img");
    image.src = contentList[i].image;
    var imageSize = contentList[i].imageSize;
    if (imageSize) {
      if (imageSize.width)  { image.width = imageSize.width }
      if (imageSize.height) { image.height = imageSize.height }
    }
    $(image).click(content.action);
    content.image = image;
    var itemExtraAttr = contentList[i].itemExtraAttr;
    if (itemExtraAttr) {
      $.each(itemExtraAttr, function(k, v) {
        $(contentDiv).attr(k, v);
      });
    }
    contentDiv.appendChild(image);
    contentDiv.appendChild(title);
    pane.appendChild(contentDiv);
  }
  return pane;
};

wpsp.map.prototype.makeTextPane = function(name, contentList, extraClass) {
  var pane = document.createElement("div");
  pane.id = name + "-pane";
  $(pane).addClass("map-pane");
  if (extraClass != undefined) {
    $(pane).addClass(extraClass);
  }
  for (var i = 0; i < contentList.length; i++) {
    var contentDiv = document.createElement("div");
    var section = new wpsp.map.TextPaneItem();
    var title = contentList[i].title;
    if (title != undefined) {
      section.title = title;
      var titleDiv = document.createElement("div");
      titleDiv.innerHTML = section.title;
      $(titleDiv).addClass("map-section-title");
      contentDiv.appendChild(titleDiv);
    }
    section.content = contentList[i].content;
    var textDiv = document.createElement("div");
    textDiv.innerHTML = section.content;
    $(textDiv).addClass("map-section-text");
    contentDiv.appendChild(textDiv);
    pane.appendChild(contentDiv);
  }
  return pane;
};

/**
 * Pane Contents.
 */
wpsp.map.ItemizedPaneItem = function() {
  this.image = undefined;
  this.title = "Title";
  this.action = function() {};
};

wpsp.map.TextPaneItem = function() {
  this.title = "Title";
  this.content = "Content";
};

/**
 * Application's map.
 */
$(document).ready(function() {
  var map = new wpsp.map;
  map.init();
  map.dataServer = wpsp.API_SERVER;

  /**
   * Use current location if available.
   */
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var center = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      if (21 < position.coords.latitude && position.coords.latitude < 49
      && 121 < position.coords.longitude && position.coords.longitude < 149) {
        // Only available area set cullent position
        map.root.setCenter(center);
      }
    }, function() {});
  } else {
    // TODO Need to generate the layers?
  }

  /**
   * Panes.
   */

  var overlayControlPane = map.makeItemizedPane("overlay", [{
    "title": "Sunshine Map",
    "action": function() {
      if (map.heatMap == undefined) {
        $.jGrowl("Sorry! The sunchine map is not ready. Please try again in a few seconds.");
        return
      }
      map.heatMap.setMap(map.heatMap.getMap() ? null : map.root);
    },
    "image": "images/layer-icon.png",
    "imageSize": { "width": 48 },
    "itemExtraClass": ["map-pane-item-horizontal"],
    "itemExtraAttr": { "data-intro": 'Show and hide the sun map', "data-step": '1', "data-position": "top" }
  }], "map-pane-bottom");

  /*
  var statusPane = map.makeItemizedPane("status", [
    {
      "title": "KWh",
      "image": "images/green.png",
      "imageSize": { "width": 16 },
      "itemExtraClass": ["map-pane-item-horizontal"]
    },
    {
      "title": "Awesomeness",
      "image": "images/orange.png",
      "imageSize": { "width": 16 },
      "itemExtraClass": ["map-pane-item-horizontal"]
    },
    {
      "title": "YA Hard-coded Value",
      "image": "images/red.png",
      "imageSize": { "width": 16 },
      "itemExtraClass": ["map-pane-item-horizontal"]
    },
  ], "map-pane-top");

  var detailPane = map.makeTextPane("detail", [{
    "title": "Detail Title",
    "content": "Detail Contents."
  }], "map-pane-left");
  */

  var mapModesPane = map.makeItemizedPane("map-modes", [
      {
        "title": "Sunny Places",
        "action": function() {
          var gradient = [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 200, 0, 1)'
          ]
          map.heatMap.setOptions({ gradient: gradient });
        },
        "image": "images/sun-icon.png",
        "imageSize": { "width": 54 },
        "itemExtraClass": ["map-pane-item-vertical"],
        "itemExtraAttr": { "data-intro": 'Green areas show the best sunlight.', "data-step": '2', "data-position": "left" }
      },
      {
        "title": "Modis Full Data",
        "action": function() {
          var gradient = [
            'rgba(200, 0, 0, 1)',
            'rgba(128, 60, 0, 1)',
            'rgba(0, 200, 0, 1)'
          ]
          map.heatMap.setOptions({ gradient: gradient });
        },
        "image": "images/satellite-icon.png",
        "imageSize": { "width": 48 },
        "itemExtraClass": ["map-pane-item-vertical"],
        "itemExtraAttr": { "data-intro": 'Blue: cloudy, Green: rather cloudy; Yellow: rather sunny; Red: sunny.', "data-step": '3', "data-position": "left" }
      },
      {
        "title": "Help",
        "action": function() {
          introJs().start();
        },
        "image": "images/help.png",
        "imageSize": { "width": 32 },
        "itemExtraClass": ["map-pane-item-horizontal"]
      }
  ], "map-pane-right");

  /**
   * Layout.
   */
  var config = {
    "panes": [
      {
        "name": "overlay",
        "position": google.maps.ControlPosition.BOTTOM_CENTER,
        "pane": overlayControlPane
      },
          /**
      {
        "name": "status",
        "position": google.maps.ControlPosition.TOP_CENTER,
        "pane": statusPane
      },
      {
        "name": "detail",
        "position": google.maps.ControlPosition.LEFT_CENTER,
        "pane": detailPane
      },
        */
      {
        "name": "map-modes",
        "position": google.maps.ControlPosition.RIGHT_CENTER,
        "pane": mapModesPane
      }
    ]
  };
  $.each(config["panes"], function(key, value) {
    map.registerPane(value["name"], value["position"], value["pane"]);
  });

});

