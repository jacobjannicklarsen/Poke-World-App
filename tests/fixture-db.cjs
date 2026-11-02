// Offline adapter for route/browser tests. Parses the supplied dump as data only;
// it never connects to MySQL or executes SQL against a real database.
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '../database/midvejsprojekt_pokemon_data.sql'), 'utf8');
function table(name) {
  const ddl = sql.match(new RegExp('CREATE TABLE `' + name + '` \\(([\\s\\S]*?)\\) ENGINE'))[1];
  const columns = [...ddl.matchAll(/^  `([^`]+)`/gm)].map(m => m[1]);
  const values = sql.match(new RegExp('INSERT INTO `' + name + '` VALUES (.*);'))[1];
  return [...values.matchAll(/\(([^()]*)\)/g)].map(match => {
    const tokens = match[1].match(/'(?:[^'\\]|\\.)*'|NULL|-?\d+/g);
    return Object.fromEntries(columns.map((column, i) => {
      const token = tokens[i];
      return [column, token === 'NULL' ? null : token.startsWith("'") ? token.slice(1, -1).replace(/\\'/g, "'") : Number(token)];
    }));
  });
}
function fixtureDatabase() {
  const pokemon = table('pokemon'), trainers = table('trainer'), catches = table('trainer_pokemon'), moves = table('moves');
  const calls = [];
  return { pokemon, trainers, catches, moves, calls, execute: async (statement, params = []) => {
    calls.push({ statement, params });
    let rows;
    if (statement === 'SELECT 1') rows = [{ 1: 1 }];
    else if (statement.startsWith('INSERT INTO trainer_pokemon')) {
      const [trainer_id, pokedex_number] = params;
      if (!trainers.some(t => t.trainer_id === trainer_id) || !pokemon.some(p => p.pokedex_number === pokedex_number)) throw Object.assign(new Error('Foreign key'), { code: 'ER_NO_REFERENCED_ROW_2' });
      if (catches.some(c => c.trainer_id === trainer_id && c.pokedex_number === pokedex_number)) throw Object.assign(new Error('Duplicate'), { code: 'ER_DUP_ENTRY' });
      catches.push({ trainer_id, pokedex_number }); rows = { affectedRows: 1 };
    } else if (statement.startsWith('SELECT trainer_id FROM trainer')) rows = trainers.filter(t => t.trainer_id === params[0]);
    else if (statement.startsWith('SELECT p.*')) rows = pokemon.filter(p => catches.some(c => c.trainer_id === params[0] && c.pokedex_number === p.pokedex_number));
    else if (statement.startsWith('SELECT * FROM trainer')) rows = trainers;
    else if (statement.startsWith('SELECT (SELECT COUNT(*)')) rows = [{ pokemon: pokemon.length, trainers: trainers.length, catches: catches.length, moves: moves.length }];
    else if (statement.startsWith('SELECT primary_type')) {
      const counts = {};
      for (const p of pokemon) counts[p.primary_type] = (counts[p.primary_type] || 0) + 1;
      rows = Object.entries(counts).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
    } else if (statement.startsWith('SELECT AVG')) {
      const keys = ['hp', 'attack', 'defence', 'special_attack', 'special_defence', 'speed'];
      rows = [Object.fromEntries(keys.map(key => [key, pokemon.reduce((sum, p) => sum + p[key], 0) / pokemon.length]))];
    } else if (statement.startsWith('SELECT * FROM pokemon')) {
      rows = pokemon;
      if (statement.includes('primary_type = ?')) rows = rows.filter(p => p.primary_type === params[0]);
      if (statement.includes('hp <= ?')) rows = rows.filter(p => p.hp <= params[1]);
      if (statement.includes('attack >= ?')) rows = rows.filter(p => p.attack >= params[0]).sort((a, b) => b.attack - a.attack);
    } else throw new Error('Unrecognized fixture query');
    return [structuredClone(rows), []];
  }};
}
module.exports = { fixtureDatabase };
