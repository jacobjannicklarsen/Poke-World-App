const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const { createApp } = require('../server/app');
const { createDatabase } = require('../server/db');
const { fixtureDatabase } = require('./fixture-db.cjs');
async function serve(t, database = fixtureDatabase(), options) {
  const server = createApp(database, options).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  return { database, base, get: route => fetch(base + route), post: body => fetch(base + '/api/catches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) };
}
test('all four pages, referenced static files, and legacy redirects resolve', async t => {
  const { get } = await serve(t);
  for (const name of ['pokemon', 'trainer', 'battle', 'dashboard']) {
    const response = await get(`/${name}.html`); assert.equal(response.status, 200);
    const html = await response.text();
    for (const page of ['pokemon', 'trainer', 'battle', 'dashboard']) assert.ok(html.includes(`href="${page}.html"`));
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
    for (const match of html.matchAll(/(?:href|src)="((?:css|js)\/[^"#]+)"/g)) assert.equal((await get('/' + match[1])).status, 200, match[1]);
  }
  for (const route of ['/', '/index.html', '/pokedex.html', '/trainers.html']) {
    const response = await get(route); assert.equal(response.status, 200);
    assert.ok(response.url.endsWith(route === '/trainers.html' ? 'trainer.html' : 'pokemon.html'));
  }
  for (const route of ['/.env', '/server/app.js', '/database/midvejsprojekt_pokemon_data.sql', '/missing.html']) assert.equal((await get(route)).status, 404);
});
test('legacy Pokémon filters preserve actual predicates and parameter binding', async t => {
  const { get, database } = await serve(t);
  for (const route of ['/api/pokemon', '/all/pokemon', '/all']) assert.equal((await (await get(route)).json()).length, 151);
  const water = await (await get('/all/water')).json(); assert.ok(water.length && water.every(p => p.primary_type === 'Water'));
  const attack = await (await get('/all/attackover50')).json(); assert.ok(attack.every(p => p.attack >= 50)); assert.ok(attack.every((p, i) => i === 0 || attack[i - 1].attack >= p.attack));
  const fire = await (await get('/all/firetypeandhpover50')).json(); assert.ok(fire.length && fire.every(p => p.primary_type === 'Fire' && p.hp <= 50));
  assert.deepEqual(database.calls.at(-1).params, ['Fire', 50]);
});
test('trainer collections and stats reflect captures; duplicate and foreign keys return useful errors', async t => {
  const { get, post, database } = await serve(t);
  assert.equal((await (await get('/api/trainers')).json()).length, 12);
  assert.equal((await (await get('/api/trainers/1/pokemon')).json()).length, 5);
  assert.equal((await get('/api/trainers/999/pokemon')).status, 404);
  const before = await (await get('/api/stats')).json();
  assert.deepEqual(before.counts, { pokemon: 151, trainers: 12, catches: 20, moves: 165 });
  assert.equal(before.types.reduce((sum, row) => sum + row.count, 0), 151);
  assert.equal((await post({ trainer_id: 1, pokedex_number: 7 })).status, 201);
  assert.ok((await (await get('/api/trainers/1/pokemon')).json()).some(p => p.pokedex_number === 7));
  assert.equal((await (await get('/api/stats')).json()).counts.catches, 21);
  assert.equal((await post({ trainer_id: 1, pokedex_number: 7 })).status, 409);
  assert.equal((await post({ trainer_id: 999, pokedex_number: 7 })).status, 404);
  assert.ok(database.calls.filter(c => c.statement.startsWith('INSERT')).every(c => c.statement.endsWith('VALUES (?, ?)')));
});
test('input validation and disabled catches prevent database writes', async t => {
  const { get, post, database } = await serve(t);
  for (const id of ['0', '-1', '1%20OR%201=1', '1.5', '2147483648']) assert.equal((await get(`/api/trainers/${id}/pokemon`)).status, 400);
  for (const body of [{}, { trainer_id: '1 OR 1=1', pokedex_number: 25 }, { trainer_id: 1, pokedex_number: -1 }]) assert.equal((await post(body)).status, 400);
  assert.equal(database.calls.length, 0);
  const disabled = await serve(t, database, { enableCatches: false });
  assert.equal((await disabled.post({ trainer_id: 1, pokedex_number: 7 })).status, 403);
  assert.equal(database.calls.length, 0);
});
test('database failures are handled without leaking credentials or SQL', async t => {
  const { get } = await serve(t, { execute: async () => { throw new Error('password=secret; SELECT * FROM private'); } });
  for (const route of ['/api/pokemon', '/api/trainers', '/api/stats', '/api/health']) {
    const response = await get(route); assert.equal(response.status, 503);
    const text = await response.text(); assert.ok(!text.includes('secret') && !text.includes('private'));
  }
  assert.equal((await get('/pokemon.html')).status, 200);
  await assert.rejects(createDatabase({}).execute('SELECT 1'), /configuration missing/);
});
test('malformed JSON is rejected as a client error', async t => {
  const { base } = await serve(t);
  const response = await fetch(base + '/api/catches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' });
  assert.equal(response.status, 400);
});
test('search, secondary type filters, sort, and numeric base stats', async () => {
  const { totalStats, filterPokemon } = await import('../public/js/pokemon.mjs');
  const db = fixtureDatabase();
  assert.equal(filterPokemon(db.pokemon, 'pikACHU')[0].pokedex_number, 25);
  assert.equal(filterPokemon(db.pokemon, '#25')[0].name, 'Pikachu');
  assert.ok(filterPokemon(db.pokemon, '', 'Flying').some(p => p.name === 'Charizard'));
  assert.equal(filterPokemon(db.pokemon, 'no-such-pokemon').length, 0);
  assert.equal(filterPokemon(db.pokemon, '', '', 'total')[0].name, 'Mewtwo');
  assert.equal(totalStats({ hp: '1', attack: '2', defence: 3, special_attack: null, special_defence: 4, speed: 5 }), 15);
  assert.equal(filterPokemon(db.pokemon, '', '', 'name')[0].name, 'Abra');
});
test('all source files still match their pre-integration hashes', () => {
  const crypto = require('node:crypto');
  const manifest = require('../docs/source-hashes.json');
  for (const [project, files] of Object.entries(manifest)) for (const [relative, hash] of Object.entries(files)) {
    const source = path.join(__dirname, '../..', project, relative);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'), hash, `${project}/${relative}`);
  }
});
