// Global variable for map - so it can be used throughout the various methods
var map;

function initMap() {

    // Default map is UWS campus
    var defaultGps = { lat: 55.779080, lng: -4.104185 };

    // Creates new Google Map using GMaps API
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: defaultGps,
        mapTypeId: 'terrain'
    });

    // Adds a marker at the center of the map
    addMarker(defaultGps);
}

// Adds a marker to the map and push to the array
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

// Moves maps to clicked location
function moveToLocation(lat, lng){
    var center = new google.maps.LatLng(lat, lng);
    // Using map global variable:
    map.panTo(center);
    map.setZoom(17);
}

// Sets map to East Kilbride when button clicked
function setEk() {
    var lat = 55.782694;
    var lng = -4.175862;
    var ek = { lat: lat, lng: lng }
    addMarker(ek);
    moveToLocation(lat, lng);   
}

// Sets maps to Glasgow when button clicked
function setGlasgow() {
    var lat = 55.867214;
    var lng = -4.238149;
    var ggow = { lat: lat, lng: lng }
    addMarker(ggow);
    moveToLocation(lat, lng);   
}

// Sets map to Hamilton when button clicked
function setHamilton() {
    var lat = 55.779667;
    var lng = -4.031322;
    var ham = { lat: lat, lng: lng }
    addMarker(ham);
    moveToLocation(lat, lng);   
}

// Sets map to Motherwell when button clicked
function setMotherwell() {
    var lat = 55.791856;
    var lng = -3.963114;
    var mwell = { lat: lat, lng: lng }
    addMarker(mwell);
    moveToLocation(lat, lng);   
}
