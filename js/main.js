 const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151"; 
// agora trazemos os 151 da 1ª geração

const listEl = document.getElementById("pokemon-list");
const searchEl = document.getElementById("search");

let allPokemons = []; // guardamos todos aqui

// Buscar Pokémons
async function fetchPokemons() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const promises = data.results.map(p => fetch(p.url).then(r => r.json()));
  allPokemons = await Promise.all(promises);

  renderPokemons(allPokemons);
}

// Renderizar cards (apenas sprite normal, nome e tipo)
function renderPokemons(pokemons) {
  listEl.innerHTML = ""; 

  pokemons.forEach(pokemon => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const types = pokemon.types.map(t => t.type.name).join(", ");

    card.innerHTML = `
      <h3>${pokemon.name}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Tipo: ${types}</p>
    `;

    // evento de clique para abrir detalhes
    card.addEventListener("click", () => openModal(pokemon));

    listEl.appendChild(card);
  });
}

// Filtro de busca
searchEl.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = allPokemons.filter(p => p.name.includes(value));
  renderPokemons(filtered);
});

// Chamar ao iniciar
fetchPokemons();

const modal = document.getElementById("pokemon-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalName = document.getElementById("modal-name");
const modalImg = document.getElementById("modal-img");
const modalTypes = document.getElementById("modal-types");
const modalStats = document.getElementById("modal-stats");
const toggleShinyBtn = document.getElementById("toggle-shiny");
const addTeamBtn = document.getElementById("add-team");

let currentPokemon = null;
let showingShiny = false;

function openModal(pokemon) {
  currentPokemon = pokemon;
  showingShiny = false;

  modalName.textContent = pokemon.name;
  modalImg.src = pokemon.sprites.front_default;
  modalTypes.textContent = "Tipo: " + pokemon.types.map(t => t.type.name).join(", ");

  // Exibir status
  const stats = pokemon.stats.map(stat => 
    `<strong>${stat.stat.name}:</strong> ${stat.base_stat}`
  ).join("<br>");
  modalStats.innerHTML = stats;

  modal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Alternar entre normal e shiny
toggleShinyBtn.addEventListener("click", () => {
  if (!currentPokemon) return;

  showingShiny = !showingShiny;
  modalImg.src = showingShiny 
    ? currentPokemon.sprites.front_shiny 
    : currentPokemon.sprites.front_default;
});

// Adicionar ao time
addTeamBtn.addEventListener("click", () => {
  if (!currentPokemon) return;

  let team = JSON.parse(localStorage.getItem("team")) || [];
  if (team.length >= 6) {
    // alert("Seu time já tem 6 Pokémons!");
    return;
  }
  if (!team.includes(currentPokemon.name)) {
    team.push(currentPokemon.name);
    localStorage.setItem("team", JSON.stringify(team));
    // alert(`${currentPokemon.name} adicionado ao time!`);
  } else {
    // alert(`${currentPokemon.name} já está no time!`);
  }
});