# Integration analysis and implementation record

## Inventory inspected before implementation

The four roots each contained one renamed HTML entry page, `main.js`, `style.css`, `theme.js`, `package.json`, `package-lock.json`, `.gitignore`, a SQL dump, and a Workbench model. Battle Lab additionally contained `battle.js`, a local `.env`, and installed `node_modules`. Battle Lab and Pokédex contained Git metadata. No backend `index.js`, other application modules, or local image directories were supplied. No applicable AGENTS.md files were found in the project roots or parent directories inspected. Git internals and dependency package source were not treated as application source. The local `.env` was not opened or copied.

An empty sibling `POKEWORLDAPP` folder existed. The requested destination was specifically `Poke World App`, so a new folder with that exact name was created. The empty existing sibling was left unchanged. An integrated VS Code workspace file was added inside the destination; the original workspace was not edited.

## Comparisons

| File(s) | Findings | Resolution |
| --- | --- | --- |
| Four `main.js` files | Identical SHA-256; Express backend with four read-only routes; fixed port 3000; mysql2 connection; broad CORS; duplicate JSON middleware; unhandled query errors; commented-out frontend fetch example | Refactored into `server/index.js`, `app.js`, `db.js`; retain all predicates/routes; pooled connections and sanitized failures; same-origin static hosting; configurable port |
| Four `theme.js` files | Identical; shared `pokemon-theme` key; assumes toggle exists in setTheme; does not update accessibility state; storage access unguarded | One `theme.mjs` with guards, validated theme, accessible button state, storage-error handling, cross-tab synchronization |
| Three shared `style.css` files | Identical mint-themed header/footer, light/dark variables, controls, responsive header | Preserved as foundation of `shared.css`; added cards/forms/status and content styling |
| Battle Lab `style.css` | Starts with exact shared stylesheet, then adds content padding, arena form/cards/results/responsive columns | Split extra rules into `battle.css`; shared cards keep a consistent appearance; arena rules loaded only on Battle Lab |
| `package.json` | Same project metadata and broken placeholder test script; three projects omit cors/mysql2 although server imports both; `main` points to absent `index.js` | New coherent package/lock with Express, dotenv, mysql2, runnable start/dev/test scripts; Playwright development dependency; no CORS dependency for same-origin app |
| Three non-battle HTML pages | Same shell and empty Pokémon grid; theme-only script; no connected data, catch logic, search, or dashboard charts | Preserve visual shell; implement requested page behaviors with their own modules |
| `battle.html`, `battle.js` | Only completed feature; fetch hardcodes localhost:3000; comparison and cards are working intent | Preserve DOM IDs/listeners, compare semantics, cards/draw/highlight; same-origin shared API helper; normalize numeric IDs/stats; disable button until data loaded |
| Four SQL dumps | Identical full SHA-256, including data | Retain one unchanged dump; document its destructive import statements and existing-schema compatibility |
| Four Workbench models | Identical full SHA-256 | Retain one unchanged model; inspect its XML and compare table/column names to SQL |

## Navigation and execution conflicts resolved

All source headers/footer brands referenced missing `index.html`; navigation also referenced nonexistent `pokedex.html` and `trainers.html`. Links now use `pokemon.html`, `trainer.html`, `battle.html`, and `dashboard.html` consistently, with exactly one `aria-current="page"`. Explicit server redirects support old bookmarks.

Only browser ES modules appear in HTML. Each HTML file loads its own page module plus the shared theme module; browser helpers are imported as needed. Node CommonJS code runs only in `server/`. The original Node backend was not loaded by the source HTML pages; its browser fetch example was only a comment. Page scripts now actually consume the backend. Module scopes prevent duplicate global declarations and handlers from unrelated pages; the theme toggle also tolerates missing markup or inaccessible storage.

The legacy `/all/firetypeandhpover50` route actually used `hp <= 50`, and `/all/attackover50` used `attack >= 50`. These predicates were deliberately preserved and documented rather than inferred from route names. `/all` was added as an alias for the old commented fetch example. Queries bind values as parameters, including fixed filter values. Errors no longer return undefined results or leak driver details.

## Database decisions

There are seven unchanged tables: `body_shape`, `gyms`, `moves`, `pokemon`, `pokemon_moves`, `trainer`, and `trainer_pokemon`. All seven Workbench table column-name sequences match the dump. Workbench additionally contains an empty `mydb` schema shell and the populated `midvejsprojekt_pokemon` model schema. No model was edited or forwarded to MySQL.

The catch feature uses the existing composite primary key on `(trainer_id, pokedex_number)`. One trainer can own each species once. A successful capture is one parameterized INSERT; duplicate/foreign-key constraints are handled explicitly. There is no startup seed, DDL, ALTER, DROP, DELETE, or update operation in the application server. Existing team data stays visible. Dashboard data comes from existing tables and is refreshed on request; no additional statistics tables are required.

## Preservation and evidence

`source-hashes.json` records all original project files excluding Git metadata, installed dependencies, and `.env`. Node tests verify every recorded hash still matches, including original package locks and SQL/model artifacts. No source files were replaced, deleted, or renamed. All implementation, documentation, generated dependencies, screenshots, and test files live in `Poke World App`.

## Limits

- Real MySQL authentication, remote network reachability, privileges, engine behavior, and real INSERT persistence were not tested. No source credentials were reused.
- Sprite URLs retain Battle Lab's external GitHub/PokeAPI sprite source. Browser tests intercept these images to remain offline; external image availability is a manual check. A failed sprite in shared cards hides the image while retaining the Pokémon's name and stats.
- Catcher/Pokédex/Dashboard behavior is new implementation of the requested features because the supplied pages did not implement it.
- Base-stat comparisons do not simulate move battles, and catch submissions do not add an unrequested probability system.
- The existing classroom schema has no login/session model. The server is bound to local loopback and is not deployed.
- All merge conflicts were resolved in the destination; the remaining limits are environmental verification tasks.
