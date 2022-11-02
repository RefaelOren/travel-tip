import { locService } from './loc.service.js';

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getCordsFromSearch,
    getToNewPos,
    getLoc,
};

// Var that is used throughout this Module (not global)
var gMap;
var infoWindow;
var gLoc = { lat:32.0749831 , lng: 34.9120554};
var gMarkers = [];


function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi().then(() => {
        console.log('google available');
        gMap = new google.maps.Map(document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15,
        });

        // Create the initial InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            content: 'Click the map to get Lat/Lng!',
            position: { lat, lng },
        });

        infoWindow.open(gMap);
        gMap.addListener('click', (mapsMouseEvent) => {
            infoWindow.close();
            let strLatlng = JSON.stringify(
                mapsMouseEvent.latLng.toJSON(),
                null,
                2
            );
            lat = JSON.parse(strLatlng).lat;
            lng = JSON.parse(strLatlng).lng;

            getToNewPos(lat, lng);
        });
        console.log('Map!', gMap);
    });
}


function getToNewPos(lat, lng, name) {
    infoWindow.close();
    setMapOnAll(null);
    if (!name) name = `lat: ${lat}, lng: ${lng}`
    infoWindow = new google.maps.InfoWindow({
        position: { lat, lng },
    });
    //   crating new info window
    infoWindow.setContent(name); //stringified

    panTo(lat, lng); //parsed
    const marker = addMarker({ lat, lng });
    console.log(lat, lng);
    console.log('whre am i');
    infoWindow.open({
        anchor: marker,
        gMap,
    })
    gLoc.lat = lat;
    gLoc.lng = lng;
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    });
    gMarkers.unshift(marker);
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = ''; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDEC76NPOn_teGIYHyM3n5tEazO-SKmivM `;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}

function getCordsFromSearch(value) {
    const apiKey = `AIzaSyDHO4cXSBexlCdpJEEmvy9cNtB1kYivveI`;
    console.log(value);
    const geolocationAPi = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${apiKey}`;

    const prm = fetch(geolocationAPi)
        .then((res) => res.json())
        .then((res) => {
            // console.log(res);
            const locName = res.results[0].formatted_address
            let { lat, lng } = res.results[0].geometry.location;
            gLoc = { lat, lng }
            getToNewPos(lat, lng, locName);

        });
}

function setMapOnAll(map) {
    for (let i = 0; i < gMarkers.length; i++) {
        gMarkers[i].setMap(map);
    }
}

function getLoc() {
    console.log(gLoc);
    return gLoc;
}




// wheather api: 7a815726955ba4c1594b3b9e2c25657c
