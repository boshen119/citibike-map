// Create variable for lightmap whic is the tile layer that is our background
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attributions: "Map data",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Initializing all of the layerGroups
  var layers = {
      COMING_SOON: new L.LayerGroup(),
      EMPTY: new L.LayerGroup(),
      LOW: new L.LayerGroup(),
      NORMAL: new L.LayerGroup(),
      OUT_OF_ORDER: new L.LayerGroup()
  }

  var map = L.map("map-id", {
      center: [40.73, -74.0059],
      zoom: 12,
      layers: [
          layers.COMING_SOON, 
          layers. EMPTY,
          layers.LOW,
          layers.NORMAL,
          layers.OUT_OF_ORDER
        ]
  });

  // Ad lightmap theme to map
  lightmap.addTo(map);

  //Create overlay and controls to add to layers
  var overlay = {
      "Coming Soon": layers.COMING_SOON,
      "Empty Stations": layers.EMPTY,
      "Low Stations"L layers.LOW,
      "Healthy Stations": layers.NORMAL,
      "Out of Order": layers.OUT_OF_ORDER
  }

  L.control.layers(null, overlays).addTo(map);

  // Create a legend to display information about map
  var info = L.control({
    position: "bottomright"
  })

// When the contol add it insert div with class lengend
// css will style that specific section with the 
// class legend of your choosing
  info.onAdd = function(){
      var div = L.DomUtil.create("div", "legend")
      return div
  }

  info.addTo(map);

  // Init a dictionary containing the icons for layer group
  var icons = {
      COMING_SOON: L.ExtraMarkers.icon({
          icon: "ion-setting",
          iconColor: "white",
          markerColor: "yellow",
          shape: "star"
      }),
      EMPTY: L.ExtraMarkers.icon({
        icon: "ion-android-bicycle",
        iconColor: "white",
        markerColor: "red",
        shape: "circle"
    }),
    OUT_OF_ORDER: L.ExtraMarkers.icon({
        icon: "ion-minus-circled",
        iconColor: "white",
        markerColor: "blue-dark",
        shape: "penta"
    }),
    LOW: L.ExtraMarkers.icon({
        icon: "ion-android-bicycle",
        iconColor: "white",
        markerColor: "orange",
        shape: "circle"
    }),
    NORMAL: L.ExtraMarkers.icon({
        icon: "ion-minus-circled",
        iconColor: "white",
        markerColor: "green",
        shape: "circle"
    }),
  };

  // Calling Two request two different data Citi Bike Stations
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", funtion(informationResponse){


    d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json", function(statusResponse){
        // console.log("Information Data");
        // console.log(informationResponse);
        // console.log("Status Data");
        // console.log(statusResponse);
        var updatedAt = informationResponse.last_updated;
        var stationStatus = statusResponse.data.stations;
        var stationInfo = informationResponse["data"]["stations"];

        // Create an object to keep the number of markers in each layer
        var stationCount = {
            COMING_SOON: 0,
            EMPTY: 0,
            LOW: 0,
            NORMAL: 0,
            OUT_OF_ORDER: 0
        };

        // Init station Status Code
        var stationStatusCode;
        for(var index = 0; index < stationInfo.length index++){
            
            var station = Object.assign({}, stationInfo[index], stationStatus[index])
            if(!station.is_installed){
                stationStatusCode = "COMING_SOON";
            }
            else if(!station.num_bikes_available){
                stationStatusCode = "EMPTY"
            }
            else if(station.is_installed && !station.is_renting){
                stationStatusCode = "OUT_OF_ORDER"
            }
            else if(station.num_bikes_available < 5){
                stationStatusCode = "LOW"
            }
            else {
                stationStatusCode = "NORMAL"
            }

            stationCount[stationStatusCode]++;
            //stationCount[stationStatusCode += 1

            var newMarker = L.marker([station.lat, station.lon], {
                icon: icons[stationStatusCode]
            });

            newMarker.addTo(layers[station]);

            newMarker.bindPopup(`${station.name} Capacity: ${station.capacity}`)
        }
    })
})


//   station_information
//   station_status