export const mapService = {
    initMap,
    addMarker,
    panTo,
    getToNewPos,
};

// Var that is used throughout this Module (not global)
var gMap;
let infoWindow

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
            content: "Click the map to get Lat/Lng!",
            position: { lat, lng },
        });

        infoWindow.open(gMap)


        //     // Configure the click listener.
        gMap.addListener("click", (mapsMouseEvent) => {


            let strLatlng = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
            lat = JSON.parse(strLatlng).lat
            lng = JSON.parse(strLatlng).lng
            getToNewPos(strLatlng, lat, lng)
            // Close the current InfoWindow.

        });


        console.log('Map!', gMap);

    });
}

function getToNewPos(strLatlng, lat, lng) {

    infoWindow.close();
    //       // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
        position: { lat, lng }
    });
    //   crating new info window
    infoWindow.setContent(strLatlng);//stringified

    panTo(lat, lng)//parsed
    const marker = addMarker(({ lat, lng }))

    infoWindow.open({
        anchor: marker,
        gMap
    });
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    });
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
