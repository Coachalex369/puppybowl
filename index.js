const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2512-FTB-CT-WEB-PT-Alex"; 
const API = BASE + COHORT;

const app = document.querySelector("#app");

let players = [];         
let selectedPlayer = null;

async function fetchPlayers() {
  const response = await fetch(API + "/players");
  const result = await response.json();
  players = result.data.players;
}

async function fetchPlayerDetails(id) {
  const response = await fetch(API + "/players/" + id);
  const result = await response.json();
  selectedPlayer = result.data.player;
}

async function init() {
  await fetchPlayers();
  render();
}

init();

async function handlePlayerClick(player) {
  await fetchPlayerDetails(player.id);
  render();
}

function render() {
  app.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.textContent = "Puppy Bowl";

  const roster = document.createElement("section");
  const h2 = document.createElement("h2");
  h2.textContent = "Roster";

  const ul = document.createElement("ul");

  for (let player of players) {
    const li = document.createElement("li");

    li.addEventListener("click", () => handlePlayerClick(player));

    const img = document.createElement("img");
    img.src = player.imageUrl;
    img.alt = player.name;

    const name = document.createElement("p");
    name.textContent = player.name;

    li.append(img, name);
    ul.appendChild(li);
  }

  roster.append(h2, ul);

 const details = document.createElement("section");

const detailsH2 = document.createElement("h2");
detailsH2.textContent = "Details";
details.appendChild(detailsH2);

if (selectedPlayer === null) {
  const p = document.createElement("p");
  p.textContent = "Select a puppy to see details 🐾";
  details.appendChild(p);
} else {
  const img = document.createElement("img");
  img.src = selectedPlayer.imageUrl;
  img.alt = selectedPlayer.name;

  const name = document.createElement("h3");
  name.textContent = selectedPlayer.name;

  const idP = document.createElement("p");
  idP.textContent = "ID: " + selectedPlayer.id;iuuui8

  const breedP = document.createElement("p");
  breedP.textContent = "Breed: " + selectedPlayer.breed;

  const statusP = document.createElement("p");
  statusP.textContent = "Status: " + selectedPlayer.status;

  const teamP = document.createElement("p");
  teamP.textContent = "Team: " + (selectedPlayer.team?.name ?? "Unassigned");

  details.append(img, name, idP, breedP, statusP, teamP);
}

  app.append(h1, roster, details);
}