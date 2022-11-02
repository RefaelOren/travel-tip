import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onSaveLocation = onSaveLocation;

function onInit() {
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        console.log('Locations:', locs);
        document.querySelector('.locs').innerText = JSON.stringify(
            locs,
            null,
            2
        );
    });
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords);
            let posDesc = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
            document.querySelector('.user-pos').innerText = posDesc;
            // mapService.panTo(pos.coords.latitude,pos.coords.longityzude)
            mapService.getToNewPos(
                posDesc,
                pos.coords.latitude,
                pos.coords.longitude
            );
        })
        .catch((err) => {
            console.log('err!!!', err);
        });
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function onSearch(ev) {
    ev.preventDefault();
    let keyword = document.querySelector('.search-input').value;
    mapService.getCordsFromSearch(keyword);
}

function onSaveLocation() {
    const cords = getLoc();
    console.log(cords);
}
