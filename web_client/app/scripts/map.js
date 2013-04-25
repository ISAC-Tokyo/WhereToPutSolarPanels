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
    center: new google.maps.LatLng(37.0625, -95.677068), // Boston
    zoom: 14,
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
      'rgba(255, 0, 0, 1)',
      'rgba(192, 128, 0, 1)',
      'rgba(0, 0, 200, 1)',
      'rgba(0, 128, 0, 1)'
    ]
    heatmap.setOptions({
      radius: $("#map").width() / 20,
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
      $(contentDiv).addClass(itemExtraClass);
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
      map.root.setCenter(center);
    }, function() {});
  } else {
    // TODO Need to generate the layers?
  }

  /**
   * Panes.
   */
  var overlayControlPane = map.makeItemizedPane("overlay", [{
    "title": "HeatMap",
    "action": function() {
      map.heatMap.setMap(map.heatMap.getMap() ? null : map.root);
    },
    "image": "images/default-image.jpeg",
    "itemExtraClass": "map-pane-item-horizontal"
  }], "map-pane-bottom");

  var statusPane = map.makeItemizedPane("status", [
    {
      "title": "KWh",
      "image": "images/green.png",
      "imageSize": { "width": 16 },
      "itemExtraClass": "map-pane-item-horizontal"
    },
    {
      "title": "Awesomeness",
      "image": "images/orange.png",
      "imageSize": { "width": 16 },
      "itemExtraClass": "map-pane-item-horizontal"
    },
    {
      "title": "YA Hard-coded Value",
      "image": "images/red.png",
      "imageSize": { "width": 16 },
      "itemExtraClass": "map-pane-item-horizontal"
    },
  ], "map-pane-top");

  var detailPane = map.makeTextPane("detail", [{
    "title": "Detail Title",
    "content": "Detail Contents."
  }], "map-pane-left");

  var spritePane = map.makeItemizedPane("sprite", [{
    "title": "Plant",
    "action": function() { alert("Plant action") },
    "image": "images/nuclear-power-plant.png",
    "itemExtraClass": "map-pane-item-vertical"
  }], "map-pane-right");

  /**
   * Layout.
   */
  var config = {
    "panes": [
      {
        "name": "overlay",
        "position": google.maps.ControlPosition.BOTTOM_CENTER,
        "pane": overlayControlPane
          /**
      },
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
      {
        "name": "sprite",
        "position": google.maps.ControlPosition.RIGHT_CENTER,
        "pane": spritePane
        */
      }
    ]
  };
  $.each(config["panes"], function(key, value) {
    map.registerPane(value["name"], value["position"], value["pane"]);
  });

});

