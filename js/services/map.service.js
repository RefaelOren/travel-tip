export const mapService = {
    initMap,
    addMarker,
    panTo,
};

// Var that is used throughout this Module (not global)
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi().then(() => {
        console.log('google available');
        gMap = new google.maps.Map(document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15,
        });
        
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: {lat, lng},
    });

    infoWindow.open(gMap)


//     // Configure the click listener.
    gMap.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();
  
//       // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
  
    //   crating new info window
    let latlng = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    infoWindow.setContent(latlng);//stringified
    latlng = JSON.parse(latlng);
    mapService.panTo(latlng)//parsed
     
      infoWindow.open(gMap);
    });


        console.log('Map!', gMap);

    });
}

// remains from google maps api documentation for getting latlng from click

//   declare global {
//     interface Window {
//       initMap: () => void;
//     }
//   }
//   window.initMap = initMap;
//   export {};
  

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
