const pokemon1Select = document.getElementById("pokemon1");
const pokemon2Select = document.getElementById("pokemon2");
const battleButton = document.getElementById("battle-button");
const battleResult = document.getElementById("battle-result");

let pokemonList = [];

fetch("/all/pokemon")
    .then(response => { if (!response.ok) throw new Error("Could not load Pokémon"); return response.json(); })
    .then(data => {

        pokemonList = data;

        data.forEach(pokemon => {

            const option1 = document.createElement("option");
            option1.value = pokemon.pokedex_number;
            option1.textContent = pokemon.name;
            pokemon1Select.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = pokemon.pokedex_number;
            option2.textContent = pokemon.name;
            pokemon2Select.appendChild(option2);

        });

    })
    .catch(error => {
        console.error(error);
        battleResult.textContent = "Could not load Pokémon from the API.";
    });

    function calculateTotal(pokemon) {

    return pokemon.hp
        + pokemon.attack
        + pokemon.defence
        + pokemon.special_attack
        + pokemon.special_defence
        + pokemon.speed;

}

function showPokemon(pokemon, number, total) {

    document.getElementById(`pokemon${number}-name`).textContent =
        pokemon.name;

    document.getElementById(`pokemon${number}-image`).src =
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedex_number}.png`;

    document.getElementById(`pokemon${number}-image`).alt =
        `Sprite of ${pokemon.name}`;

    document.getElementById(`pokemon${number}-stats`).textContent =
        `HP: ${pokemon.hp}
Attack: ${pokemon.attack}
Defence: ${pokemon.defence}
Special Attack: ${pokemon.special_attack}
Special Defence: ${pokemon.special_defence}
Speed: ${pokemon.speed}`;

    document.getElementById(`pokemon${number}-total`).textContent =
        total;

}

battleButton.addEventListener("click", () => {

    const pokemon1 = pokemonList.find(pokemon =>
        pokemon.pokedex_number === Number(pokemon1Select.value)
    );

    const pokemon2 = pokemonList.find(pokemon =>
        pokemon.pokedex_number === Number(pokemon2Select.value)
    );

    if (!pokemon1 || !pokemon2) {
        battleResult.textContent = "Please select two Pokémon!";
        return;
    }

    if (pokemon1.pokedex_number === pokemon2.pokedex_number) {
        battleResult.textContent = "Choose two different Pokémon!";
        return;
    }

    const total1 = calculateTotal(pokemon1);
    const total2 = calculateTotal(pokemon2);
    // Vis begge Pokémon'er og deres "stats".
showPokemon(pokemon1, 1, total1);
showPokemon(pokemon2, 2, total2);

// Visning af "battle cards".
document.getElementById("battle-display").hidden = false;

// Highlight på den Pokémon der vinder.
document.getElementById("pokemon1-card").classList.toggle(
    "winner", total1 > total2
);

document.getElementById("pokemon2-card").classList.toggle(
    "winner", total2 > total1
);

    if (total1 > total2) {

        battleResult.textContent =
            `${pokemon1.name} (${total1}) defeats ${pokemon2.name} (${total2})!`;

    } else if (total2 > total1) {

        battleResult.textContent =
            `${pokemon2.name} (${total2}) defeats ${pokemon1.name} (${total1})!`;

    } else {

        battleResult.textContent =
            `Draw! Both Pokémon have ${total1} total base stats.`;

    }

});