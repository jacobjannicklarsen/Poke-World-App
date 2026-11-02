const pokemonGrid = document.getElementById("pokemon-grid");
const filterBar = document.getElementById("type-filter");

let allPokemon = [];
let currentCry = null;
let currentType = "all";
let searchText = "";
let sortBy = "default";

const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

const types = [
    { name: "normal",   emoji: "⚪" },
    { name: "fire",     emoji: "🔥" },
    { name: "water",    emoji: "💧" },
    { name: "electric", emoji: "⚡" },
    { name: "grass",    emoji: "🌿" },
    { name: "ice",      emoji: "❄️" },
    { name: "fighting", emoji: "🥊" },
    { name: "poison",   emoji: "☠️" },
    { name: "ground",   emoji: "🌍" },
    { name: "flying",   emoji: "🕊️" },
    { name: "psychic",  emoji: "🔮" },
    { name: "bug",      emoji: "🐛" },
    { name: "rock",     emoji: "🪨" },
    { name: "ghost",    emoji: "👻" },
    { name: "dragon",   emoji: "🐉" },
    { name: "dark",     emoji: "🌑" },
    { name: "steel",    emoji: "⚙️" },
    { name: "fairy",    emoji: "🧚" }
];
function applyFilters() {
    const filtered = allPokemon.filter(p => {
        const matchesType =
            currentType === "all" ||
            String(p.primary_type).toLowerCase() === currentType ||
            String(p.secondary_type).toLowerCase() === currentType;

        const matchesName = p.name.toLowerCase().includes(searchText);

        return matchesType && matchesName;
    });

    if (sortBy === "default") {
        filtered.sort((a, b) => a.pokedex_number - b.pokedex_number);
    } else if (sortBy.endsWith("-desc")) {
        const stat = sortBy.replace("-desc", "");
        filtered.sort((a, b) => b[stat] - a[stat]);
    } else {
        filtered.sort((a, b) => a[sortBy] - b[sortBy]);
    }

    renderCards(filtered);
}

searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim().toLowerCase();
    applyFilters();
});

sortSelect.addEventListener("change", () => {
    sortBy = sortSelect.value;
    applyFilters();
});
// ---------- Filter buttons ----------
function makeButton(type, label) {
    const btn = document.createElement("button");
    btn.className = "type-btn";
    btn.dataset.type = type;
    btn.textContent = label;
    btn.addEventListener("click", () => {
        filterBar.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentType = type;
        applyFilters();


    });
    return btn;
}

const allBtn = makeButton("all", "✨ All");
allBtn.classList.add("active");
filterBar.appendChild(allBtn);

types.forEach(t => {
    const label = t.emoji + " " + t.name.charAt(0).toUpperCase() + t.name.slice(1);
    filterBar.appendChild(makeButton(t.name, label));
});

// ---------- Cards ----------
function renderCards(list) {
    pokemonGrid.innerHTML = "";
    if (list.length === 0) {
        pokemonGrid.textContent = "No Pokémon found.";
        return;
    }
    list.forEach(pokemon => {
        const card = document.createElement("article");
        card.classList.add("card");

        const image = document.createElement("img");
        image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedex_number}.png`;
        image.alt = pokemon.name;
        image.classList.add("pokemon-image");
        image.loading = "lazy";

        const name = document.createElement("h3");
        name.textContent = pokemon.name;

        const number = document.createElement("p");
        number.textContent = `#${String(pokemon.pokedex_number).padStart(3, "0")}`;

        const type = document.createElement("p");
        type.textContent = `Type: ${pokemon.primary_type}`;

        const hp = document.createElement("p");
        hp.textContent = `HP: ${pokemon.hp}`;

        const attack = document.createElement("p");
        attack.textContent = `Attack: ${pokemon.attack}`;

        const defence = document.createElement("p");
        defence.textContent = `Defence: ${pokemon.defence}`;

        const playButton = document.createElement("button");
        playButton.type = "button";
        playButton.classList.add("play-button");
        playButton.textContent = "▶ Play cry";
        playButton.setAttribute("aria-label", `Play ${pokemon.name} cry`);

        const cry = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.pokedex_number}.ogg`);
        cry.preload = "none";

        playButton.addEventListener("click", () => {
            if (currentCry && currentCry !== cry) {
                currentCry.pause();
            }
            currentCry = cry;
            cry.currentTime = 0;
            cry.play().catch(() => { playButton.textContent = "Cry unavailable"; });
        });

        card.append(image, name, number, type, hp, attack, defence, playButton);
        pokemonGrid.appendChild(card);
    });
}

// ---------- Fetch ----------
fetch("/all/pokemon")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch Pokémon data");
        }
        return response.json();
    })
    .then(data => {
        allPokemon = data;
        applyFilters();
    })
    .catch(error => {
        console.error("Error fetching Pokémon:", error);
        pokemonGrid.textContent = "Could not load Pokémon. Check that the server and database are running.";
    });