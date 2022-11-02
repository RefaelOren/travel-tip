import { storage } from './storage.service.js';

export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    getLocDesc
};
const apiKey = `AIzaSyDHO4cXSBexlCdpJEEmvy9cNtB1kYivveI`;

const STORAGE_KEY = 'locsDB';

let locs = [
    {
        id: 1,
        name: 'Greatplace',
        lat: 32.047104,
        lng: 34.832384,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 2,
        name: 'Neveragain',
        lat: 32.047201,
        lng: 34.832581,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];

function getLocs() {
    locs = storage.load(STORAGE_KEY) ? storage.load(STORAGE_KEY, locs) : locs
    return locs

}

function getLocDesc({lat, lng}){
    const revGeolocationAPi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    return fetch(revGeolocationAPi)
        .then(res => res.json())
        .then(res =>res.results[1].formatted_address)
}


function addLoc({ lat, lng }, desc) {

            const newId = locs.length + 1
            const loc = { id: newId, name, lat, lng, createdAt: Date.now() }
            locs.push(loc)
            storage.save(STORAGE_KEY, locs)
            return loc
}


function deleteLoc(id) {
    const idx = locs.findIndex(loc=> loc.id===id )
    locs.splice(idx, 1)
    console.log(locs, id-1);
    storage.save(STORAGE_KEY, locs)
}
