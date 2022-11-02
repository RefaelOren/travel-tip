import { storage } from './storage.service.js';

export const locService = {
    getLocs,
    addLoc,
};
const apiKey = `AIzaSyDHO4cXSBexlCdpJEEmvy9cNtB1kYivveI`;

const STORAGE_KEY = 'locsDB';

const locs = [
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
storage.save(STORAGE_KEY, locs);

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000);
    });
}

function addLoc({ lat, lng }) {
    const revGeolocationAPi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const locPrm = fetch(revGeolocationAPi)
        .then((res) => res.json())
        .then((res) => {
            // console.log(res);
            const name = res.results[1].formatted_address;
            console.log(name);
            const newId = locs.length + 1;
            const loc = { id: newId, name, lat, lng, createdAt: Date.now() };
            locs.unshift(loc);
            storage.save('locs', locs);
            return loc;
        });
    locPrm.then((res) => console.log(res));
}
