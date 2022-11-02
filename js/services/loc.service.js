import { storage } from './storage.service.js';

export const locService = {
    getLocs,
    addLoc,
};

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

function addLoc(lat, lng) {
    console.log(lat, lng);
}
