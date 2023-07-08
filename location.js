let x = document.getElementById("demo");
let coords = {lat: "", lon: ""};
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    // console.log(coords.lat);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  // coords.lat = position.coords.latitude;
  // coords.lon = position.coords.longitude;
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
}
