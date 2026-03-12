const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2512-FTB-CT-WEB-PT-Alex";
const API = BASE + COHORT;

const app = document.querySelector("#app");

let players = [];
let selectedPlayer = null;

async function fetchPlayers() {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    players = result.data.players;
  } catch (error) {
    console.error("Failed to fetch players:", error);
  }
}

async function fetchPlayerDetails(id) {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    selectedPlayer = result.data.player;
  } catch (error) {
    console.error("Failed to fetch player details:", error);
  }
}

async function removePlayer(id) {
  try {
    await fetch(API + "/players/" + id, {
      method: "DELETE",
    });

    selectedPlayer = null;
    await fetchPlayers();
    render();
  } catch (error) {
    console.error("Failed to remove player:", error);
  }
}

async function addPlayer(playerObj) {
  try {
    await fetch(API + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });

    await fetchPlayers();
    render();
  } catch (error) {
    console.error("Failed to add player:", error);
  }
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

function PuppyListItem(player) {
  const li = document.createElement("li");

  li.addEventListener("click", () => handlePlayerClick(player));

  const img = document.createElement("img");
  img.src = player.imageUrl;
  img.alt = player.name;

  const name = document.createElement("p");
  name.textContent = player.name;

  li.append(img, name);
  return li;
}

function PuppyRoster() {
  const roster = document.createElement("section");

  const h2 = document.createElement("h2");
  h2.textContent = "Roster";

  const ul = document.createElement("ul");

  for (let player of players) {
    const li = PuppyListItem(player);
    ul.appendChild(li);
  }

  roster.append(h2, ul);
  return roster;
}

function PuppyDetails() {
  const details = document.createElement("section");

  const detailsH2 = document.createElement("h2");
  detailsH2.textContent = "Details";
  details.appendChild(detailsH2);

  if (selectedPlayer === null) {
    const p = document.createElement("p");
    p.textContent = "Select a puppy to see details 🐾";
    details.appendChild(p);
    return details;
  }

  const img = document.createElement("img");
  img.src = selectedPlayer.imageUrl;
  img.alt = selectedPlayer.name;

  const name = document.createElement("h3");
  name.textContent = selectedPlayer.name;

  const idP = document.createElement("p");
  idP.textContent = "ID: " + selectedPlayer.id;

  const breedP = document.createElement("p");
  breedP.textContent = "Breed: " + selectedPlayer.breed;

  const statusP = document.createElement("p");
  statusP.textContent = "Status: " + selectedPlayer.status;

  const teamP = document.createElement("p");
  teamP.textContent = "Team: " + (selectedPlayer.team?.name ?? "Unassigned");

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove from roster";
  removeBtn.addEventListener("click", async () => {
    await removePlayer(selectedPlayer.id);
  });

  details.append(img, name, idP, breedP, statusP, teamP, removeBtn);
  return details;
}

function AddPuppyForm() {
  const section = document.createElement("section");

  const h2 = document.createElement("h2");
  h2.textContent = "Add a Puppy";

  const form = document.createElement("form");

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Name";

  const nameInput = document.createElement("input");
  nameInput.name = "name";
  nameInput.required = true;

  const breedLabel = document.createElement("label");
  breedLabel.textContent = "Breed";

  const breedInput = document.createElement("input");
  breedInput.name = "breed";
  breedInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Puppy";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const newPlayer = {
      name: formData.get("name"),
      breed: formData.get("breed"),
    };

    await addPlayer(newPlayer);
    form.reset();
  });

  form.append(nameLabel, nameInput, breedLabel, breedInput, submitBtn);
  section.append(h2, form);

  return section;
}

function render() {
  app.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.textContent = "Puppy Bowl";

  const roster = PuppyRoster();
  const details = PuppyDetails();
  const form = AddPuppyForm();

  app.append(h1, form, roster, details);
}