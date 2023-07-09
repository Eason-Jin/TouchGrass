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
let friends;
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = "117664448852004891398";
const API_KEY = "nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuQ4JoyQjtCvNn\nsSKTXw1CTRFy+OrUDkdU/+HAoz5X0KgWsK04mCsfyyF6u4vgKOmM0dYFVGD0DHqG\n39KVsUNCPp58vWc+mDiwGFnzEtkwQFggqPGvzhRpEOp19+Ek8GkxrZsHWXGrJAna\niFbOn6T4TLAM0Gj4DM6aZhweVKpePhU2ZTrpz0iBr0cqKxVoqgVBpnSCDsQmwrcP\nRU/m0EAmM6NIgDf2D9IswbysZLgTpobUgTM8GanX/dnpswLBVn6YTG4ySfvzU2c4\ns1C2EiQhjTlGoM2SwOYTJLVqgYp24nVZp+/NECI3JN4wXuxWxUPnH6P6811NpJ41\nsg2FE4BpAgMBAAECggEAJAwtfAkH+mbfQmYbOaJ6Luqbzy1sACki+tOCqrNqCEbO\nmoD6GCCsHQPLPWTx0pEL/NgEPm59rsYtC1zd5h64w8mJxdJ1OrbI1S54XuaZfFh3\nEmx4ME6AHNrFsVjxHw/HJuJbVRocwBLwod69nDjcaouMiF4NNLCLhVdVfjWz11IG\nfRcpqsTlNgx3x0z5NcCnZ/OV+jmu70efdqeM/MU88SfKbHRDQ1NcPHAkONx/trom\nlvZRtrQftMGnKDjgNfuet2ZrFgcnUD/rLXb+4iu2vYFZ6Q5hjGmLUWgfl/L6xSKc\nbjMcN99u1WEugxJ2wbkNePGfdf9vISVYzTDRKlaabQKBgQD1ImC6L2ep02frSYP/\nEozX5/lq3YLY2taY5PObxT0wJTpob+qnahXYHQuwbmnMshD4bWkp1Y6ubKStzLSf\nK8e2CPgPNLGRey6nCUbTedyT9VeTPIeVCbZXzPBj4JEO6wE5i1YReThvW1aN7PYh\nAhGKFbr7jTIema/aLddkvBOajQKBgQC1/PBh2tJs/pF/xSmyAiQpPIUTnepWt24h\npOMy7tzx+x2A9MYeonboz3A929Gx91L56NcJPozwMf8wX7VynQ2RmoLF42UEjT3X\n+d3efLpV14ZAAivdzIPm617n3Da5sxWZ7N9nB+KecbyOOZmLo0LoLCfDz/czzjzf\nqoURRkcUTQKBgQCntzCk0iBDwh98jJzh3Kg+ZDly00Fd60Qd8a926Rj3ItF2ePP8\nPQnbBexkdvauFTqlLf5gn/tx/WUigEcoDAUk17gYdz3yQmxl3mP19o9jL94OH8DH\nyJBYPCBQxWmZ4lHBNELby6tADScIDZNMfCTR7BI1X6Jl61K0nN6czk0/VQKBgAel\nDW/+4jID65bDcIHyxxQYX7q4OnzUDcNKCuU71Xoww0eEgMIOrxIOjLd8gW2JZynq\nVwYjY4Y/g2nDy3p6EHTaWb34VGkBieSFsYVEFgu/FvufW7pgefX8UytIO+BHHpQt\nuCC62xEu0+3hi4qrHAdmu3DlTowVkMcQgbB9FEVNAoGBAPH0P+D0A0ZSuX9Zlhfv\nXwrujBoXagfyAkqSSToHksIiMkH+bLyeIyzZuNCxr2ai7o2cIghb31cuxgPo+69s\n8dlmyJt4eLjEXcSQ/YuK9fJoQ7vaMRgS90aNa+62oN1np/9ygsCY8DHjtUhIgpvX\n3+hT+KDA0jal1zRbvZAoWXLF";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await listMajors();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1ttEuCrgWGGU8Pr_ebK9JDwkZ36wli4hu_Cs0rWZDqYE",
      range: "Sheet1!A1:D",
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById("content").innerText = "No values found.";
    return;
  }
  // Flatten to string to display
  const output = range.values.reduce(
    (str, row) => `${str}${row[0]}, ${row[4]}\n`,
    "Name, Major:\n"
  );
  friends = output;
}

friends = [
  ["venimental", -36.851614014548, 174.76977539764798, 4],
  ["easonjin", -36.84173956740042, 174.7633716524264, 5],
  ["schinyang", -36.871089388573395, 174.77695697763556, 3],
  ["spooder", -36.877488908272646, 174.75191862975146, 2],
  ["zhi", -36.857581133743714, 174.76346794693325, 1],
];

const meetUpMissionCoordinate = [-36.84805834184518, 174.767335453466];
const touristMissionCoordinate = [-36.86066249995613, 174.77774696256145];
const actionMissionCoordinate = [-36.85139486936094, 174.76395445346617];

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
  await calculateDistance(friends, { lat: -36.853125, lng: 174.767625 });
}

function getCoordinates() {
  return new Promise(function (resolve, reject) {
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

      new google.maps.Marker({
        position: { lat: pos.lat, lng: pos.lng },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillOpacity: 1,
          strokeWeight: 2,
          fillColor: "#4285F4",
          strokeColor: "#ffffff",
        },
        title: "Current Location",
        zIndex: 100000000,
      });
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
    scaledSize: new google.maps.Size(25, 25),
  };
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

function initMeetupMissionMarker(map, meetUpMissionCoordinate) {
  const icon = {
    url: "https://preview.redd.it/hwkhiyhixza81.png?width=108&crop=smart&auto=webp&s=8e388c927966806d2a62d50362aa514ca07e3ba3",
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(35, 35),
  };
  new google.maps.Marker({
    position: {
      lat: meetUpMissionCoordinate[0],
      lng: meetUpMissionCoordinate[1],
    },
    map,
    icon,
    title: "Meet-up Mission",
    zIndex: 1000000,
  });
}

function initTouristMissionMarker(map, touristMissionCoordinate) {
  const icon = {
    url: "https://static.wikia.nocookie.net/gensin-impact/images/c/cf/Icon_Archon_Quest.png/revision/latest/thumbnail/width/360/height/360?cb=20210615060053",
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(35, 35),
  };
  new google.maps.Marker({
    position: {
      lat: touristMissionCoordinate[0],
      lng: touristMissionCoordinate[1],
    },
    map,
    icon,
    title: "Tourist Mission",
    zIndex: 1000000,
  });
}

function initActionMissionMarker(map, actionMissionCoordinate) {
  const icon = {
    url: "https://static.wikia.nocookie.net/gensin-impact/images/6/67/Icon_World_Quest.png/revision/latest/thumbnail/width/360/height/360?cb=20210615060104",
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(43, 43),
  };
  new google.maps.Marker({
    position: {
      lat: actionMissionCoordinate[0],
      lng: actionMissionCoordinate[1],
    },
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
  const destinations = [];
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    const destination = { lat: friend[1], lng: friend[2] };
    destinations.push(destination);
  }

  const request = {
    origins: [origin],
    destinations,
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  console.log(JSON.stringify(request, null, 2));

  // MAKING A REQUEST TO THE DISTANCE MATRIX SERVICE API - get distance matrix response
  const distanceMatrix = await service.getDistanceMatrix(request);
  console.log(JSON.stringify(distanceMatrix, null, 2));

  modifyDistancesHTML(friends, distanceMatrix);
}

function modifyDistancesHTML(friends, distanceMatrix) {
  const elements = distanceMatrix.rows[0].elements;
  const distances = [];
  for (let i = 0; i < elements.length; i++) {
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

  const distancesListElement = document.getElementById("distances-list");
  for (let i = 0; i < distances.length; i++) {
    const distance = distances[i];

    const li = document.createElement("li");
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
