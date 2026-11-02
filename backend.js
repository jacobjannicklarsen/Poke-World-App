const path = require('node:path');
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = express();
app.use(require('cors')());
app.use(express.json());
const connection = mysql.createPool({
    host: process.env.DBHOST, user: process.env.DBUSER,
    password: process.env.DBPASSWORD, database: process.env.DBDATABASE,
    connectTimeout: 5000
});
function query(res, sql, values = []) {
    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('Database query failed:', error.code);
            return res.status(500).json({ message: 'Could not access the database. Check the server configuration.' });
        }
        res.json(results);
    });
}
app.get('/all/pokemon', (req, res) => query(res, 'SELECT * FROM pokemon'));
app.get('/all/water', (req, res) => query(res, "SELECT * FROM pokemon WHERE primary_type = 'Water'"));
app.get('/all/attackover50', (req, res) => query(res, 'SELECT * FROM pokemon WHERE attack >= 50 ORDER BY attack DESC'));
app.get('/all/firetypeandhpover50', (req, res) => query(res, "SELECT * FROM pokemon WHERE primary_type = 'Fire' AND hp <= 50"));
app.get('/all/trainers', (req, res) => query(res, 'SELECT * FROM trainer ORDER BY trainer_id'));
app.get('/all/trainers/pokemon/:trainer_name', (req, res) => query(res,
    'SELECT p.* FROM pokemon p JOIN trainer_pokemon tp ON p.pokedex_number = tp.pokedex_number JOIN trainer t ON t.trainer_id = tp.trainer_id WHERE t.trainer_name = ?',
    [req.params.trainer_name]));
app.post('/all/trainers/new', (req, res) => {
    const { name, hometown, age } = req.body || {};
    if (typeof name !== 'string' || !name.trim() || typeof hometown !== 'string' || !hometown.trim()
        || age == null || age === '' || !Number.isInteger(Number(age)) || Number(age) < 0) {
        return res.status(400).json({ message: 'Enter a name, hometown, and a valid age.' });
    }
    connection.query('INSERT INTO trainer (trainer_name, hometown, age) VALUES (?, ?, ?)',
        [name.trim(), hometown.trim(), Number(age)], (error, result) => {
            if (error) return res.status(500).json({ message: 'Could not create the trainer.' });
            res.status(201).json({ message: 'Trainer created', trainer_id: result.insertId });
        });
});
app.post('/all/trainers/pokemon/new', (req, res) => {
    const { trainer_id, pokedex_number } = req.body || {};
    if (![trainer_id, pokedex_number].every(value => Number.isInteger(Number(value)) && Number(value) > 0)) {
        return res.status(400).json({ message: 'Enter a valid trainer ID and Pokédex number.' });
    }
    connection.query('INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?, ?)',
        [Number(trainer_id), Number(pokedex_number)], error => {
            if (error) {
                const status = ['ER_NO_REFERENCED_ROW_2', 'ER_DUP_ENTRY'].includes(error.code) ? 400 : 500;
                return res.status(status).json({ message: status === 400
                    ? 'Check that the trainer and Pokémon exist and that this catch is not already registered.'
                    : 'Could not register the catch.' });
            }
            res.status(201).json({ message: 'Pokémon caught!' });
        });
});
app.get('/stats/avg-attack', (req, res) => query(res,
    'SELECT primary_type AS label, ROUND(AVG(attack), 1) AS value FROM pokemon GROUP BY primary_type ORDER BY value DESC'));
app.get('/stats/type-count', (req, res) => query(res,
    'SELECT primary_type AS label, COUNT(*) AS value FROM pokemon GROUP BY primary_type ORDER BY value DESC'));
app.get('/stats/top-trainers', (req, res) => query(res,
    'SELECT trainer.trainer_name AS label, COUNT(*) AS value FROM trainer JOIN trainer_pokemon ON trainer_pokemon.trainer_id = trainer.trainer_id GROUP BY trainer.trainer_id, trainer.trainer_name ORDER BY value DESC'));
app.get('/stats/body-shape-speed', (req, res) => query(res,
    'SELECT body_shape.type AS label, ROUND(AVG(pokemon.speed), 1) AS value FROM body_shape JOIN pokemon ON pokemon.body_shape_id = body_shape.body_shape_id GROUP BY body_shape.body_shape_id, body_shape.type ORDER BY value DESC'));
// Only browser assets are public; settings and database files stay private.
const browserFiles = ['index.html', 'pokemon.html', 'trainer.html', 'dashboard.html', 'battle.html',
    'style.css', 'pokemon.css', 'theme.js', 'pokemon.js', 'frontend.js', 'dashboard.js', 'battle.js'];
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get(browserFiles.map(file => '/' + file), (req, res) => res.sendFile(path.join(__dirname, path.basename(req.path))));
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log('PokéWorld is running at http://localhost:' + port));
}
module.exports = { app, connection };
