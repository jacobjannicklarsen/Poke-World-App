const express = require('express');
const path = require('node:path');
function createApp(database, { enableCatches = true } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '8kb' }));
  const query = async (sql, params = []) => (await database.execute(sql, params))[0];
  const list = (route, sql, params = []) => app.get(route, async (req, res) => res.json(await query(sql, params)));
  list(['/api/pokemon', '/all', '/all/pokemon'], 'SELECT * FROM pokemon ORDER BY pokedex_number');
  list('/all/water', 'SELECT * FROM pokemon WHERE primary_type = ?', ['Water']);
  list('/all/attackover50', 'SELECT * FROM pokemon WHERE attack >= ? ORDER BY attack DESC', [50]);
  // Preserve legacy behavior even though the route name says "over50".
  list('/all/firetypeandhpover50', 'SELECT * FROM pokemon WHERE primary_type = ? AND hp <= ?', ['Fire', 50]);
  list('/api/trainers', 'SELECT * FROM trainer ORDER BY trainer_id');
  const validId = value => /^(?:[1-9]\d*)$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) <= 2147483647;
  app.get('/api/trainers/:id/pokemon', async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid trainer ID.' });
    const trainers = await query('SELECT trainer_id FROM trainer WHERE trainer_id = ?', [Number(req.params.id)]);
    if (!trainers.length) return res.status(404).json({ error: 'Trainer not found.' });
    res.json(await query('SELECT p.* FROM pokemon p JOIN trainer_pokemon tp ON p.pokedex_number = tp.pokedex_number WHERE tp.trainer_id = ? ORDER BY p.pokedex_number', [Number(req.params.id)]));
  });
  app.post('/api/catches', async (req, res) => {
    if (!enableCatches) return res.status(403).json({ error: 'Catching is disabled for this server.' });
    const { trainer_id, pokedex_number } = req.body || {};
    if (!validId(trainer_id) || !validId(pokedex_number)) return res.status(400).json({ error: 'Choose a valid trainer and Pokémon.' });
    try {
      await query('INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?, ?)', [Number(trainer_id), Number(pokedex_number)]);
      res.status(201).json({ message: 'Pokémon caught!', trainer_id: Number(trainer_id), pokedex_number: Number(pokedex_number) });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'This trainer has already caught that Pokémon.' });
      if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({ error: 'Trainer or Pokémon not found.' });
      throw error;
    }
  });
  app.get('/api/stats', async (req, res) => {
    const counts = await query('SELECT (SELECT COUNT(*) FROM pokemon) AS pokemon, (SELECT COUNT(*) FROM trainer) AS trainers, (SELECT COUNT(*) FROM trainer_pokemon) AS catches, (SELECT COUNT(*) FROM moves) AS moves');
    const types = await query('SELECT primary_type AS type, COUNT(*) AS count FROM pokemon GROUP BY primary_type ORDER BY count DESC, primary_type');
    const averages = await query('SELECT AVG(hp) AS hp, AVG(attack) AS attack, AVG(defence) AS defence, AVG(special_attack) AS special_attack, AVG(special_defence) AS special_defence, AVG(speed) AS speed FROM pokemon');
    res.json({ counts: counts[0], types, averages: averages[0] });
  });
  app.get('/api/health', async (req, res) => { await query('SELECT 1'); res.json({ status: 'ok' }); });
  for (const [from, to] of Object.entries({ '/': '/pokemon.html', '/index.html': '/pokemon.html', '/pokedex.html': '/pokemon.html', '/trainers.html': '/trainer.html' })) {
    app.get(from, (req, res) => res.redirect(302, to));
  }
  app.use(express.static(path.join(__dirname, '../public'), { index: false }));
  app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large.' });
    // Do not expose SQL, connection details, credentials, or driver messages.
    res.status(503).json({ error: 'Database unavailable. Check the server database configuration and schema.' });
  });
  return app;
}
module.exports = { createApp };
