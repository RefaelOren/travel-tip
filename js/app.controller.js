import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onSaveLocation = onSaveLocation;
window.onGo = onGo;
window.onDeleteLoc = onDeleteLoc;

function onInit() {
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    renderLocs();
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
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            locService.getLocDesc({ lat, lng }).then((posDesc) => {
                console.log(posDesc);
                // document.querySelector('.user-pos').innerText = posDesc;
                // mapService.panTo(pos.coords.latitude,pos.coords.longityzude)
                mapService.getToNewPos(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    posDesc
                );
            }); //`Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
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
    const cords = mapService.getLoc();
    console.log(cords);
    const desc = locService.getLocDesc(cords).then((res) => {
        console.log(res);
        return res;
    });
    const locs = locService.getLocs();
    console.log(locs);
    locService.addLoc(cords, desc);
    renderLocs(locs);
}

function renderLocs(locs) {
    if (!locs) locs = locService.getLocs();
    console.log(locs);
    const elLocsContainer = document.querySelector('.locs-container');
    const strHTML = locs
        .map(
            ({ name, id, createdAt, lat, lng }) =>
                `<article class="loc-card">
                    <p class="card-name">${name}</p>
                    <p class="card-weather">weather</p>
                    <p class="cart-date">${createdAt}</p>
                    <button class="btn go-btn" onclick="onGo('${lat}', '${lng}', '${name}')">Go</button>
                    <button class="btn delete-btn" onclick="onDeleteLoc(${id})" >Delete</button>
                 </article>
                `
        )
        .join('');
    elLocsContainer.innerHTML = strHTML;
}

function onGo(lat, lng, name) {
    mapService.getToNewPos(+lat, +lng, name);
}
function onDeleteLoc(id) {
    console.log(id);
    locService.deleteLoc(id);
    const locs = locService.getLocs();
    renderLocs(locs);
}
