/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

const friends = [
  ["venimental", -36.851614014548, 174.76977539764798, 4],
  ["easonjin", -36.84173956740042, 174.7633716524264, 5],
  ["schinyang", -36.871089388573395, 174.77695697763556, 3],
  ["spooder", -36.877488908272646, 174.75191862975146, 2],
  ["zhi", -36.857581133743714, 174.76346794693325, 1],
];

let markers = []

const meetUpMissionCoordinate = [-36.84805834184518, 174.767335453466];
const touristMissionCoordinate = [-36.86066249995613, 174.77774696256145];
const actionMissionCoordinate = [-36.85139486936094, 174.76395445346617];

var reqcount = 0;

navigator.geolocation.watchPosition(successCallback, errorCallback, options);

function successCallback(position) {
	let pos ={};
  //const { accuracy, latitude, longitude, altitude, heading, speed } = position.coords;
  pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  }
    // Show a map centered at latitude / longitude.
    reqcount++;
    console.log("Longitude: " + pos.lng);
    console.log("Latitude: " + pos.lat);
    console.log("Run Number: " + reqcount);
    
    
    calculateDistance(friends, pos);
    //deleteMarkers();
    //createMarkers(pos);
}
function errorCallback(error) {
	
}
function clearList(){
  const distancesListElement = document.getElementById('distances-list');
  while( distancesListElement.firstChild ){
    distancesListElement.removeChild( distancesListElement.firstChild );
  }
}
function deleteMarkers(){
  hideMarkers();
  markers = [];
}
function createMarkers(pos){
  marker = new google.maps.marker({
    position: { lat: pos.lat, lng: pos.lng},
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillOpacity: 1,
      strokeWeight: 2,
      fillColor: '#4285F4',
      strokeColor: '#ffffff',
    },
    title: "Current Location",
    zIndex: 100000000,
  });
}
var options = {
	enableHighAccuracy: false,
	timeout: 5000,
	maximumAge: 0
};

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -36.85319342072366, lng: 174.76944325517317 },
    zoom: 14,
    });

    const myLocation = await setCurrentLocation(map);
    initMarkers(map, friends);
    initMeetupMissionMarker(map, meetUpMissionCoordinate);
    initTouristMissionMarker(map, touristMissionCoordinate);
    initActionMissionMarker(map, actionMissionCoordinate);
    await calculateDistance(friends, myLocation);
}

function getCoordinates() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function setCurrentLocation(map) {
  // Try HTML5 geolocation.
  let pos = {};
  if (navigator.geolocation) {
    try {
      const coordinates = await getCoordinates();
      pos = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      };
  
      map.setCenter(pos);
  
      var currentLocationMarker = new google.maps.Marker({
        position: { lat: pos.lat, lng: pos.lng},
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillOpacity: 1,
          strokeWeight: 2,
          fillColor: '#4285F4',
          strokeColor: '#ffffff',
        },
        title: "Current Location",
        zIndex: 100000000,
      });
      markers.push(CurrentLocationMarker);
    } catch (e) {
      handleLocationError(true, infoWindow, map.getCenter());
    }
  } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
  }
  return pos;
}

function initMarkers(map, friends) {
  const icon = {
    url: "https://i.pinimg.com/originals/65/45/d7/6545d7586aa48bdf487ea306d7cd853b.png",
    size: new google.maps.Size(300, 300),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(25, 25)
  }
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];

    new google.maps.Marker({
      position: { lat: friend[1], lng: friend[2] },
      map,
      icon,
      // icon: {
      //   path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      //   scale: 8,
      //   fillOpacity: 1,
      //   strokeWeight: 2,
      //   fillColor: '#AB33FF',
      //   strokeColor: '#ffffff',
      // },
      title: friend[0],
      zIndex: friend[3],
    });
  }
}

function initMeetupMissionMarker(map, meetUpMissionCoordinate){
  const icon = {
    url: "https://preview.redd.it/hwkhiyhixza81.png?width=108&crop=smart&auto=webp&s=8e388c927966806d2a62d50362aa514ca07e3ba3",
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(35, 35)
  }
  new google.maps.Marker({
    position: { lat: meetUpMissionCoordinate[0], lng: meetUpMissionCoordinate[1] },
    map,
    icon,
    title: "Meet-up Mission",
    zIndex: 1000000,
  });
}

function initTouristMissionMarker(map, touristMissionCoordinate){
  const icon = {
    url: "https://static.wikia.nocookie.net/gensin-impact/images/c/cf/Icon_Archon_Quest.png/revision/latest/thumbnail/width/360/height/360?cb=20210615060053",
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(35, 35)
  }
  new google.maps.Marker({
    position: { lat: touristMissionCoordinate[0], lng: touristMissionCoordinate[1] },
    map,
    icon,
    title: "Tourist Mission",
    zIndex: 1000000,
  });
}

function initActionMissionMarker(map, actionMissionCoordinate){
  const icon = {
    url: "https://static.wikia.nocookie.net/gensin-impact/images/6/67/Icon_World_Quest.png/revision/latest/thumbnail/width/360/height/360?cb=20210615060104",
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(43, 43)
  }
  new google.maps.Marker({
    position: { lat: actionMissionCoordinate[0], lng: actionMissionCoordinate[1] },
    map,
    icon,
    title: "Action Mission",
    zIndex: 1000000,
  });
}

async function calculateDistance(friends, origin) {
  // initialize services to get the api to make the requests to
  const service = new google.maps.DistanceMatrixService();

  // build the request to send to the distance matrix service api
  const destinations = []
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    const destination = {lat: friend[1], lng: friend[2]};
    destinations.push(destination);
  }

  const request = {
    origins: [origin],
    destinations,
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  console.log(JSON.stringify(
    request,
    null,
    2
  ));

  // MAKING A REQUEST TO THE DISTANCE MATRIX SERVICE API - get distance matrix response
  const distanceMatrix = await service.getDistanceMatrix(request);
  console.log(JSON.stringify(
    distanceMatrix,
    null,
    2
  ));

    modifyDistancesHTML(friends, distanceMatrix);
}

function modifyDistancesHTML(friends, distanceMatrix) {
  const elements = distanceMatrix.rows[0].elements;
  const distances = [];
  for (let i = 0; i < elements.length; i++){
    const friendDistance = elements[i].distance.value;
    const friendDuration = elements[i].duration.text;
    const friendName = friends[i][0];

    distances.push([friendName, friendDistance, friendDuration]);
  }

  distances.sort((friendA, friendB) => {
    if (friendA[1] > friendB[1]) {
      return 1;
    } else if (friendA[1] < friendB[1]) {
      return -1;
    }
    return 0;
  });

  const distancesListElement = document.getElementById('distances-list');
  clearList();
  for (let i = 0; i < distances.length; i++) {
    const distance = distances[i];

    const li = document.createElement('li');
    li.innerText = `${distance[0]}: ${distance[1]}m (${distance[2]})`;
    distancesListElement.appendChild(li);
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
    browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

window.initMap = initMap;