import { api, status, pokemonCard, element } from './shared.mjs';
import { filterPokemon } from './pokemon.mjs';
const grid = document.getElementById('pokemon-grid');
const search = document.getElementById('search');
const type = document.getElementById('type-filter');
const sort = document.getElementById('sort');
let list = [];
function render() {
  const filtered = filterPokemon(list, search.value, type.value, sort.value);
  grid.replaceChildren(...filtered.map(pokemonCard));
  status(filtered.length ? `${filtered.length} of ${list.length} Pokémon` : 'No Pokémon match your filters.');
}
for (const input of [search, type, sort]) input.addEventListener('input', render);
try {
  status('Loading Pokémon…');
  list = await api('/api/pokemon');
  const types = [...new Set(list.flatMap(p => [p.primary_type, p.secondary_type]).filter(Boolean))].sort();
  for (const name of types) { const option = element('option', name); option.value = name; type.append(option); }
  render();
} catch (error) { status(error.message, true); }
