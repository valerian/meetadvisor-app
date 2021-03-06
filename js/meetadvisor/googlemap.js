﻿var GoogleMap = function GoogleMap() {};

GoogleMap.prototype = {

	position: null,
	parent: null,
	target: null,
	onReady: null,
	map: null,
	
	init: function(that, updating, handler) {
		this.onReady = handler;
		this.parent = that;
		
		if (!this.isGMapsAlreadyLoaded()) {
			this.loadGmapApi(that);
		} else if (!updating) {
			this.gMapInit(that);
		}
	},
	
	isGMapsAlreadyLoaded: function () {
		if (typeof(google)== 'undefined') {
			return false;
        } else {
            if (typeof(google.maps) == 'undefined') {
                return false;
            } else {
                return true;
            }
        }
    },
	
	loadGmapApi: function (instance) {
		var sensorValue = this.isGpsDevice() ? "true" : "false";
		var that = this;
		
		$.getJSON('https://www.google.com/jsapi?callback=?', function () {		
			google.load('maps', 3.9, {
				callback: function () {
					that.gMapInit(instance);
				},
				other_params: "sensor="+sensorValue
			});
		});
	},
	
	isGpsDevice: function() {
		// TODO : If phonegap gps device is dectected then set param sensor to true
		return false;
	},
	
	gMapInit: function (that) {
		// Manage geolocated coordonates : 48;2 is Paris
		this.position = new google.maps.LatLng(48.85872551801016, 2.3372126802368243);
		
		if (this.isGpsDevice()) {
			// TODO RETRIEVE GPS LOCATION		
		} else if (this.isGoogleClientLocation()) {
			this.position = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
		}
		
		// Define map options
		var mapOptions = {
            zoom: 12,
            center: this.position,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: true,
            scrollwheel: false,
            streetViewControl: true
        };
	
        this.setMap(new google.maps.Map(that.settings.mapContainer, mapOptions));

		// Set map position & marker with geolocated data
		this.map.setCenter(this.position);
		
		// save center after move
		google.maps.event.addListener(this.map, 'mouseup', function() {
			that.gmap.position = that.gmap.getMap().getCenter();
			console.log("center changed: " + that.gmap.position.lat() + " " + that.gmap.position.lng());
		});

		// resize handler		
		$(window).resize(function () {
			that.gmap.getMap().setCenter(that.gmap.position);
			console.log("resize !" + that.gmap.position.lat() + " " + that.gmap.position.lng());
		});
			
		// fire the ready event !
		this.onReady(that);
    },

	gMapSetMarker: function (lat, lng, clickEvent, maData, maParent, mkgImage) {
		
		// Store instance
		var that = this;

   //      this.gMapMarker = new google.maps.Marker({
   //          map: that.getMap(),
   //          position: new google.maps.LatLng(lat, lng),
			// icon: mkgImage,
   //          animation: google.maps.Animation.DROP,
			// data: maData,
			// parent: maParent,

   //      });

        this.gMapMarker = new RichMarker({
          map: that.getMap(),
          position: new google.maps.LatLng(lat, lng),
          draggable: false,
          flat: true,
          data: maData,
          parent: maParent,
          anchor: RichMarkerPosition.BOTTOM,
          content: '<div class="map-marker"><div class="map-marker-picto"><img width="22" height="23" src="' + mkgImage 
          + '"/></div><div class="map-marker-name">' + maData.name + '</div></div>'
          });

		
		google.maps.event.addListener(this.gMapMarker, 'click', clickEvent);

	},
	
	gMapCreateInfoWindow: function (marker, content, pos, hght) {
	    // v1
		// var coordInfoWindow = new google.maps.InfoWindow();
		// coordInfoWindow.setContent(content);
		// coordInfoWindow.setPosition(pos);
		// this.position = pos;
		console.log("click: center changed" + this.position.lat() + "  " +  this.position.lng());
		//coordInfoWindow.open(this.map);
		
		// v2
		infoBubble2 = new InfoBubble({
          content: '<div class="phoneytext">' + content + '</div>',
		  padding: 0,
		  backgroundColor: '#f5f5f5',
          borderWidth: 1,
          backgroundClassName: 'phoney',
          borderColor: '#aaaaaa',
		  borderRadius: '0px',
          hideCloseButton: true,
          height: hght,
        });
        infoBubble2.open(this.map, marker);
	
		return (infoBubble2);		
	},
	
	
	isGoogleClientLocation: function() {
	
		if (typeof(google.loader) == "undefined") {
			return false;
		} else {
			if (typeof(google.loader.ClientLocation) == "undefined" || google.loader.ClientLocation == null) {
				return false;
			} else {
				return true;
			}
		}

	},
	
	/* GETTERS - SETTERS */
	getMap: function() {
		return this.map;
	},
	
	setMap: function(gMap) {
		this.map = gMap;
	}

}





