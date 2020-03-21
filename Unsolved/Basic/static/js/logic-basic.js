// var newYorkCoords = [40.73, -74.0059];
// var mapZoomLevel = 12;

// Create the createMap function
function createMap(bikeStations){

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attributions: "Map data & copy",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center:[40.73, -74.0059],
    zoom: 12,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
// Create the createMarkers function
function createMarkers(response){
  console.log(response);


  // Pull the "stations" property off of response.data
  var stations = response.data.stations; // stations is a list, we can loop through it

  // Initialize an array to hold bike markers
  var bikeMarkers = []
  // Loop through the stations array
  for (var index = 0; index < stations.length; index++){
    var station = stations[index]; // add this here for readability so you don't have to call index in lat/lon

    // For each station, create a marker and bind a popup with the station's name
    var bikeMarker = L.marker([station.lat, station.lon])
      .bindPopup(`<h3>${station.name}</h3><hr/><h3>Capacity: ${station.capacity}</h3>`)


    // Add the marker to the bikeMarkers array
    bikeMarkers.push(bikeMarker);


  }
  // Create a layer group made from the bike markers array, pass it into the createMap function
  var bikeStations = L.layerGroup(bikeMarkers);
  createMap(bikeStations);

}
// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", createMarkers);