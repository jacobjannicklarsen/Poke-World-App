import { statLabels, totalStats } from './pokemon.mjs';
export async function api(path, options = {}) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}
export function status(message, error = false) {
  const target = document.getElementById('page-status');
  if (target) { target.textContent = message; target.dataset.error = String(error); }
}
export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function sprite(pokemon) {
  const img = element('img');
  img.width = 120; img.height = 120; img.loading = 'lazy';
  img.alt = `Sprite of ${pokemon.name}`;
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Number(pokemon.pokedex_number)}.png`;
  img.addEventListener('error', () => { img.hidden = true; }, { once: true });
  return img;
}
export function pokemonCard(pokemon) {
  const card = element('article', undefined, 'pokemon-card');
  card.append(element('span', `#${String(pokemon.pokedex_number).padStart(3, '0')}`, 'muted'), sprite(pokemon), element('h2', pokemon.name));
  const types = element('p');
  for (const type of [pokemon.primary_type, pokemon.secondary_type].filter(Boolean)) types.append(element('span', type, 'badge'));
  card.append(types);
  const stats = element('dl');
  for (const [key, label] of Object.entries(statLabels)) stats.append(element('dt', label), element('dd', pokemon[key] ?? '—'));
  card.append(stats, element('p', `Total base stats: ${totalStats(pokemon)}`));
  return card;
}
export function fillSelect(select, rows, valueKey, labelKey) {
  for (const row of rows) { const option = element('option', row[labelKey]); option.value = row[valueKey]; select.append(option); }
}
