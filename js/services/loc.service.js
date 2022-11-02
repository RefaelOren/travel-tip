export const locService = {
    getLocs,
    addLoc,
}

import {storage} from'./storage.service.js'

const apiKey = `AIzaSyDHO4cXSBexlCdpJEEmvy9cNtB1kYivveI`;

const locs = [
    { id:1 ,name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt:Date.now(), updatedAt: Date.now() ,  }, 
    { id:2 ,name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt:Date.now(), updatedAt: Date.now() ,  }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function addLoc({lat, lng}){
   const revGeolocationAPi =  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    const locPrm = fetch(revGeolocationAPi)
    .then(res=>res.json())
    .then(res=>{
        const name = res.results[1].formatted_address
        const newId = locs.length+1
        const loc = {id:newId, name, lat, lng, createdAt:Date.now()}
        locs.unshift(loc)
        storage.save('locs',locs )
        return loc
    })
locPrm.then(res=>console.log(res));
}


