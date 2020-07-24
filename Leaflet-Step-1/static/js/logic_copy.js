console.log("hello, there!")

let earthQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

let mymap = L.map("mapid", {
    center: [15,20],
    zoom: 3
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10', //dark-v10
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);

//data load from json
d3.json(earthQuery).then(earthquakes=> {

    let eventQuake = earthquakes.features
    console.log("events", eventQuake)

    eventQuake.forEach(d =>{

        let depth = d.geometry.coordinates[2]

        let earthColor;
        if (d.properties.mag > 7){
            earthColor = "#5F0F40"
        } else if (d.properties.mag > 6){
            earthColor = "#9A031E"
        } else if (d.properties.mag > 5){
            earthColor = "#A94A0F"
        } else if(d.properties.mag > 4){
            earthColor = "#FB8B24"
        } else if (d.properties.mag > 3){
            earthColor = "#0F4C5C"
        } else {
            earthColor = "#757575"
        } 

        let magMulti;
            if(d.properties.mag > 7){
                magMulti =  d.properties.mag * 70000
            } else if (d.properties.mag > 6){
                magMulti =  d.properties.mag * 60000
            } else if (d.properties.mag > 5){
                magMulti =  d.properties.mag * 50000
            } else if (d.properties.mag > 4){
                magMulti =  d.properties.mag * 35000
            } else if (d.properties.mag > 3){
                magMulti =  d.properties.mag * 30000
            } else {
                magMulti = d.properties.mag * 20000
            }
        
        L.circle([d.geometry.coordinates[1], d.geometry.coordinates[0]],{
            color: "#e5e6e4",
            fillColor: earthColor,
            fillOpacity: 0.7,
            radius: magMulti,
            weight: 2
        }).bindPopup(`<h3>Magnitude: ${d.properties.mag}</h3> <hr>
            <h4>Location: ${d.properties.place}</h4>
            <h4>Depth: ${depth} km`).addTo(mymap);
        
    })
})

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Magnitudes</h4>";
  div.innerHTML += '<i style="background: #5F0F40"></i> <span> >7 </span><br>';
  div.innerHTML += '<i style="background: #9A031E"></i> <span> 6 - 7 </span><br>';
  div.innerHTML += '<i style="background: #A94A0F"></i> <span> 5 - 6 </span><br>';
  div.innerHTML += '<i style="background: #FB8B24"></i> <span> 4 - 5 </span><br>';
  div.innerHTML += '<i style="background: #0F4C5C"></i> <span> 3 - 4</span><br>';
  div.innerHTML += '<i style="background: #757575"></i> <span> 2.5 - 3 </span><br>';

  return div;
};

legend.addTo(mymap);