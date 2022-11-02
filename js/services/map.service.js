import { storage } from './storage.service.js';

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getCordsFromSearch,
    getToNewPos,
};

// Var that is used throughout this Module (not global)
var gMap;
let infoWindow;
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

        //     // Configure the click listener.
        gMap.addListener('click', (mapsMouseEvent) => {
            // Close the current InfoWindow.
            infoWindow.close();
            let strLatlng = JSON.stringify(
                mapsMouseEvent.latLng.toJSON(),
                null,
                2
            );
            lat = JSON.parse(strLatlng).lat;
            lng = JSON.parse(strLatlng).lng;

            getToNewPos(strLatlng, lat, lng);
        });

        console.log('Map!', gMap);
    });
}

function getToNewPos(strLatlng, lat, lng) {
    infoWindow.close();

    setMapOnAll(null);

    infoWindow = new google.maps.InfoWindow({
        position: { lat, lng },
    });
    //   crating new info window
    infoWindow.setContent(strLatlng); //stringified

    panTo(lat, lng); //parsed
    const marker = addMarker({ lat, lng });

    infoWindow.open({
        anchor: marker,
        gMap,
    });
    locService.addLoc('aa')
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    });
    gMarkers.push(marker);
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

            console.log(res);
            let { lat, lng } = res.results[0].geometry.location;
            getToNewPos(value, lat, lng);
        });
}

function setMapOnAll(map) {
    for (let i = 0; i < gMarkers.length; i++) {
        gMarkers[i].setMap(map);
    }
}
