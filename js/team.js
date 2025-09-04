 const teamListEl = document.getElementById("team-list");

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

// Função para buscar e renderizar o time
async function renderTeam() {
  const team = JSON.parse(localStorage.getItem("team")) || [];
  if (team.length === 0) {
    teamListEl.innerHTML = "<p>Seu time está vazio.</p>";
    return;
  }

  // Buscar dados completos dos pokémons do time
  const promises = team.map(name =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(r => r.json())
  );
  const pokemons = await Promise.all(promises);

  teamListEl.innerHTML = "";
  pokemons.forEach(pokemon => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const types = pokemon.types.map(t => t.type.name).join(", ");

    card.innerHTML = `
      <h3>${pokemon.name}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Tipo: ${types}</p>
      <button class="remove-btn" data-name="${pokemon.name}">Remover</button>
    `;

    // Evita abrir o modal ao clicar no botão remover
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) return;
      openModal(pokemon);
    });

    // Evento para remover do time
    card.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromTeam(pokemon.name);
    });

    teamListEl.appendChild(card);
  });
}

// Função para remover do time
function removeFromTeam(name) {
  let team = JSON.parse(localStorage.getItem("team")) || [];
  team = team.filter(pokeName => pokeName !== name);
  localStorage.setItem("team", JSON.stringify(team));
  renderTeam();
}

// Modal igual ao da pokedex
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

// Adicionar ao time (sem alertas)
addTeamBtn.addEventListener("click", () => {
  if (!currentPokemon) return;

  let team = JSON.parse(localStorage.getItem("team")) || [];
  if (team.length >= 6) {
    return;
  }
  if (!team.includes(currentPokemon.name)) {
    team.push(currentPokemon.name);
    localStorage.setItem("team", JSON.stringify(team));
    renderTeam(); // Atualiza a lista
  }
});

// Inicializa a página
renderTeam();