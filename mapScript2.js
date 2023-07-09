// Used to toggle the menu on small screens when clicking on the menu button
function myFunction() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

let walkBadge = {
  distance: 10,
  unlocked: false,
};
let peopleBadge = {
  people: 5,
  unlocked: false,
};

let distWalked = 0;
let peopleMet = 0;
const distGoal = 10;
const peopleGoal = 5;
let peopleCheck = "";
let walkCheck = "";

// Retrieve data from database, repeat this function every 5 seconds
function walkFunction() {
  console.log("walkFunction");
  const distSaved = JSON.parse(localStorage.getItem("distWalked"));

  if (distSaved) {
    distWalked = distSaved;
  }

  let newWalk = 1;
  localStorage.setItem("distWalked", JSON.stringify(distWalked + newWalk));

  if (distWalked >= distGoal) {
    walkCheck = ' checked="checked"';
    clearInterval(walkInterval);
  }

  render();
}

function peopleFunction() {
  console.log("peopleFunction");
  const peopleSaved = JSON.parse(localStorage.getItem("peopleMet"));

  if (peopleSaved) {
    peopleMet = peopleSaved;
  }

  let newPeople = 1;
  localStorage.setItem("peopleMet", JSON.stringify(peopleMet + newPeople));

  if (peopleMet >= peopleGoal) {
    peopleCheck = ' checked="checked"';
    clearInterval(peopleInterval);
  }

  render();
}

function checktimepass() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  console.log(today.tostring());
  if (h == 0 && m == 0 && s == 0) {
    localStorage.clear();
    distWalked = 0;
    peopleMet = 0;
    walkCheck = "";
    peopleCheck = "";

    walkInterval = setInterval(walkFunction, 1000);
    peopleInterval = setInterval(peopleFunction, 1000);
    render();
  }
  setTimeout(checktimepass, 1000);
}

let walkInterval = setInterval(walkFunction, 1000);
let peopleInterval = setInterval(peopleFunction, 1000);
let timeInterval = setInterval(checktimepass, 1000);

function render() {
  console.log("render");
  const ulEl = document.getElementById("ul-el");

  ulEl.innerHTML = `
  <li>
    <p>
      Distance walked: ${distWalked} / ${distGoal} km
      <label class="container-checkbox">
        <input type="checkbox" ${walkCheck}>
        <span class="checkmark"></span>
      </label>
    </p>
  </li>
  <li>
    <p>
      People met: ${peopleMet} / ${peopleGoal} person(s)
      <label class="container-checkbox">
        <input type="checkbox" ${peopleCheck}>
        <span class="checkmark"></span>
      </label>
    </p>
  </li>
  <li>
    <p>
      <img src="images/tourist.png" alt="walking icon"/> Visit the museum
      <label class="container-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
      </label>
    </p>  
  </li>
  <li>
    <p>
      <img src="images/world.png" alt="walking icon"/> Explore the GameOn arcade
      <label class="container-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
      </label>  
    </p>  
  </li>
  <li>
    <p>
      <img src="images/meet.png" alt="walking icon"/> Meet and mingle in Chancery Square
      <label class="container-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
      </label>  
    </p>  
  </li>`;
}

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", function () {
  localStorage.clear();
  distWalked = 0;
  peopleMet = 0;
  walkCheck = "";
  peopleCheck = "";

  walkInterval = setInterval(walkFunction, 1000);
  peopleInterval = setInterval(peopleFunction, 1000);
  render();
});
