export const statLabels = { hp: 'HP', attack: 'Attack', defence: 'Defence', special_attack: 'Special Attack', special_defence: 'Special Defence', speed: 'Speed' };
export function totalStats(pokemon) { return Object.keys(statLabels).reduce((sum, key) => sum + (Number(pokemon[key]) || 0), 0); }
export function filterPokemon(list, search = '', type = '', sort = 'number') {
  const term = search.trim().toLowerCase().replace(/^#/, '');
  const result = list.filter(p => (!term || p.name.toLowerCase().includes(term) || String(p.pokedex_number) === term) && (!type || p.primary_type === type || p.secondary_type === type));
  return result.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'total' ? totalStats(b) - totalStats(a) : Number(a.pokedex_number) - Number(b.pokedex_number));
}
