var Map = function Map() {};

Map.prototype = {
	
	map: null,

	init: function(request_params, updating) {
		var ui = new MeetAdvisorUi();
		ui.setSkin();
		
		if (!this.isGMapsAlreadyLoaded()) {
			this.loadGmapApi();
		} else if (!updating) {
			this.gMapInit();
		}

		this.updatePopup(request_params);
	},
	
    updatePopup: function (request_params) {
        if (request_params && request_params.popup) {
            // show popup
		    document.getElementById('popup-overlay').style.display = 'block';
		    
		    // bind close popup button
		    $("#close-popup").click(function() {
			    //reset hash
			    location.hash = '#' + meetadvisor.current_page;
		    });
		    
            popup_render_data = new MeetAdvisorRenderData();
            popup_render_data.page.file = request_params.popup;
            popup_render_data.inner_rendering_id = 'popup-box';
            meetadvisor.render(popup_render_data);
        }
        else {
			$("#popup-box").empty();
			document.getElementById('popup-overlay').style.display = 'none';
        }
    },

	loadGmapApi: function () {

		var instance_ = this;
		var sensorValue = this.isGpsDevice() ? "true" : "false";
		
		$.getJSON('https://www.google.com/jsapi?callback=?', function () {		
		
			google.load('maps', 3.4, {
				callback: function () {
					instance_.gMapInit();
				},
				other_params: "sensor="+sensorValue
			});
		});

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
	
	isGpsDevice: function() {
		// TODO : If phonegap gps device is dectected then set param sensor to true
		return false;
	},
	
	isHtml5Geolocation: function() {
		// TODO : Check if html5 geoLocation is available
		return false;	
	},
	
	gMapInit: function () {
    	
		// Manage geolocated coordonates
		var geolocatedLat = "40.730885";
		var geolocatedLng = "-73.997383";
		
		if (this.isGpsDevice()) {
			// TODO RETRIEVE GPS LOCATION		
		} else if (this.isGoogleClientLocation()) {
			geolocatedLat = google.loader.ClientLocation.latitude;
			geolocatedLng = google.loader.ClientLocation.longitude;		
		} else if (this.isHtml5Geolocation()) {
			// USE HTML5 GEOLOCATION
		}
		
		// Define map options
		var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(geolocatedLat, geolocatedLng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: true,
            scrollwheel: false,
            streetViewControl: true
        };
	
        this.setMap(new google.maps.Map(this.settings.mapContainer, mapOptions));

		// Set map position & marker with geolocated data
		this.gMapSetPosition(geolocatedLat, geolocatedLng);
		this.gMapSetMarker(geolocatedLat, geolocatedLng);
		
    },
	
    gMapSetPosition: function (lat, lng) {
        this.getMap().setCenter(new google.maps.LatLng(lat, lng));
    },
	
	gMapSetMarker: function (lat, lng) {
		
		// Store instance
		var instance_ = this;

        this.gMapMarker = new google.maps.Marker({
            map: instance_.getMap(),
            position: new google.maps.LatLng(lat, lng),
            animation: google.maps.Animation.DROP
        });

		// some test
		google.maps.event.addListener(this.gMapMarker, 'click', this.onWindowClick);

	},
	
	onWindowClick: function (evt) {
		var coordInfoWindow = new google.maps.InfoWindow();
		coordInfoWindow.setContent('Le Charlus<br />bar de quartier<br/> Distance: 900 metres<br/>Reduc: happy hour toute la nuit pour les filles<br/> <a href="#map/popup/place">PLUS D INFOS</a></buttons>');
		coordInfoWindow.setPosition(evt.latLng);
		coordInfoWindow.open(this.map);
	},
	
	showInfoWindow: function (lat, lng, message) {
		var point = new google.maps.LatLng(lat, lng);
		var coordInfoWindow = new google.maps.InfoWindow();
		
        coordInfoWindow.setContent(message);
        coordInfoWindow.setPosition(point);
        coordInfoWindow.open(this.map);
	},

	/* GETTERS - SETTERS */
	getMap: function() {
		return this.map;
	},
	
	setMap: function(gMap) {
		this.map = gMap;
	}
}




