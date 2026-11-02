# Poke World

The four projects are combined in this folder. The original sibling folders are retained as source copies.

## Run locally

1. Run `npm install` (use `npm.cmd install` if PowerShell blocks npm.ps1).
2. Configure `.env` using `.env.example` as a guide. The existing Battle Lab settings were copied during the merge.
3. Start MySQL with the project's existing database. For a fresh database, create `midvejsprojekt_pokemon` in MySQL Workbench, select it, and import `midvejsprojekt_pokemon_data.sql`. The dump replaces tables, so import it only into a fresh database.
4. Run `npm start` (or `npm.cmd start`).
5. Open <http://localhost:3000>.

Only this backend needs to run. Stop any older project server using port 3000 first, or set `PORT` in `.env` to another port. Open the pages through the server so their relative API requests work.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home and links to all features |
| `pokemon.html`, `pokemon.js`, `pokemon.css` | Pokédex search, type filters, sorting, images, and cries |
| `trainer.html`, `frontend.js` | Create trainers, register catches, list trainers, and view collections |
| `battle.html`, `battle.js` | Compare two Pokémon by their total base stats |
| `dashboard.html`, `dashboard.js` | Four charts using database statistics |
| `backend.js` | Shared Express server and all MySQL API routes |
| `style.css`, `theme.js` | Shared layout and saved light/dark theme |
| `midvejsprojekt_pokemon_data.sql` | Existing database schema and seed data |
| `midvejsprojekt_pokemon_database.mwb` | Existing MySQL Workbench model |

The server reads `DBHOST`, `DBUSER`, `DBPASSWORD`, `DBDATABASE`, and optional `PORT` from `.env`. Database credentials and SQL/model files are not served to the browser.

Pokémon sprites and cries load from the PokeAPI GitHub repositories; Chart.js loads from jsDelivr. These features require internet access.
