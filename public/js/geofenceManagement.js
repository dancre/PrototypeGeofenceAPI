
// var endpointURL = 'http://127.0.0.1:3000/geofences'
var endpointURL = 'https://www.luda.design/geofences'


function initialize() {
    let point = [-43.530918, 172.634825]; // Default - Middle of Chch CBD.

    // check for Geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let point = [position.coords.latitude, position.coords.longitude]
            //console.log('Position Accuracy: ' + position.coords.accuracy + ' meters.');
            google.maps.event.addDomListener(window, 'load', initMap(point));
        },
        function(positionError) {
            console.warn('ERROR(' + positionError.code + '): ' + positionError.message );
            google.maps.event.addDomListener(window, 'load', initMap(point));
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }
    else {        
        google.maps.event.addDomListener(window, 'load', initMap(point));
    }    
};

function initMap(point) {

    var currentPosition = new google.maps.LatLng(point[0], point[1]);

    map = new google.maps.Map(document.getElementById("map"), {
        center: currentPosition,
        zoom: 15,
        clickableIcons: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.VERTICAL_BAR,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        fullscreenControl: false,
        styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]        
    });

    // map.panTo(latlng);

    if(self.fetch) {
        fetch('/geofences')
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            for(var i = 0; i < json.length; i++) {

                var longitude = parseFloat(json[i].obj.geometry.coordinates[0]);
                var latitude = parseFloat(json[i].obj.geometry.coordinates[1]);
                var point = new google.maps.LatLng(latitude, longitude);

                var circle = new google.maps.Circle({
                    center: point,
                    draggable: true,
                    map: map,
                    zIndex: 1,
                    radius: 50, // Meters
                    fillColor: '#FF6600',
                    fillOpacity: 0.5,
                    strokeColor: "#FFF",
                    strokeWeight: 0,
                });

                // google.maps.event.addListener(circle, 'radius_changed', function() {
                //     console.log('radius changed: ' + circle.getRadius()); // circle.setRadius (meters)
                // });
                // google.maps.event.addListener(circle, 'center_changed', function() {
                //     console.log('center changed: ' + circle.getCenter());
                // });
                google.maps.event.addListener(circle, 'dragend', function() {
                    console.log('center changed: ' + circle.getCenter());
                });

                // Remove a circle from map: circle.setMap(null);
                // Delete circle : circle = null;
                // Method setOptions(options:CircleOptions) - use for changing color on mouse hover.(fillColor: #ffffff, fillOpacity: 0.5, zIndex: 1)
                // Other useful events: click, dblclick, mouseover, mouseout (change color on hover), rightclick
            }
        })
        .catch();
    } else {
        // do something with XMLHttpRequest?
    }

    // This event listener will call addMarker() when the map is clicked.    
    map.addListener('click', function(event) {    
        addCircle(event.latLng);    
    });
};

function addCircle(latlng) {
    var circle = new google.maps.Circle({
        center: latlng,
        draggable: true,
        map: map,
        zIndex: 1,
        radius: 50, // Meters
        fillColor: '#FF6600',
        fillOpacity: 0.5,
        strokeColor: "#FFF",
        strokeWeight: 0,
    }); 

    let venue_id = document.getElementById('venue_id').value || 1
    saveGeofence(venue_id ,latlng);

    // google.maps.event.addListener(circle, 'radius_changed', function() {
    //     console.log('radius changed: ' + circle.getRadius());
    // });
    // google.maps.event.addListener(circle, 'center_changed', function() {
    //     console.log('center changed: ' + circle.getRadius());
    // });
    google.maps.event.addListener(circle, 'dragend', function() {
        console.log('center changed: ' + this.getCenter());
        //saveGeofence(this.getCenter());
    });
};

function saveGeofence(venue_id, latlng) {
    var request = new Request('/geofences', {
        method: 'POST', 
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            id: venue_id,
            latitude: latlng.lat(),
            longitude: latlng.lng()
        })        
    });

    fetch(request).then(function(geofence) {
        return geofence; 
    });  
}

function deleleAll() {
    var oReq = new XMLHttpRequest();
    oReq.open("delete", endpointURL);
    oReq.send();

    window.location.reload(false);
};

function getGeofences() {
    // check for Geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            var url = new URL(endpointURL),
                params = {latitude:position.coords.latitude, longitude:position.coords.longitude}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url).then(function(response) {
                // Do something with json response
            });

        },
        function(positionError) {
            console.warn('ERROR(' + positionError.code + '): ' + positionError.message );
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }
    else {        
        console.warn("Could not get geo location.")
    }  
};

function getGeofence() {

};

function getGeoLocation() {
    
};

window.onload = initialize;