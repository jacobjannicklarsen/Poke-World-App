# Validation and regression checklist

Executed locally on 2 November 2026 with Node.js 26.10.0, npm 11.19.1, and installed Microsoft Edge via Playwright. The app requires Node >=22. All owned test servers and browser instances close when the tests finish.

## Automated results

`npm.cmd test`: **8 tests passed, 0 failed**.

- Four HTML pages and their linked scripts/styles return 200; navigation links and active-page state exist on each page; legacy entry paths redirect.
- `.env`, backend source, and SQL artifacts are not exposed by the static server.
- Original four API routes retain their actual filter predicates and bound query values; Pokémon aliases return 151 records with the supplied fixture.
- Trainer collection, counts, capture submission, duplicate species, foreign-key failure, and count refresh behave correctly through real HTTP routes.
- Invalid IDs and SQL-looking input are rejected before database access; disabling catches prevents writes.
- Database failures return sanitized 503 errors while HTML still loads; malformed JSON returns 400.
- Search by case-insensitive name/number, primary/secondary types, sort order, and numeric base-stat totals work.
- All recorded original source files match their pre-integration SHA-256 hashes.

`npm.cmd run test:browser`: **passed in headless Microsoft Edge**.

- Browser ES modules load and render 151 Pokémon without page JavaScript exceptions.
- Name search, empty result, secondary-type filter, and total-stat sorting.
- All 16 from/to navigation combinations across four pages; correct active-page indicator.
- Theme toggle updates the page and accessible state; preference survives navigation.
- Missing selection, same selection, winner highlighting, six-stat cards, and draw behavior in Battle Lab.
- Trainer collection, successful capture, reload persistence within the fixture server, and duplicate catch feedback.
- Dashboard counts and six stat meters, with refresh.
- All four pages have no horizontal document overflow at 320px and 390px, including visible battle cards.
- API failures show an error on Pokédex and Battle Lab; battle submission stays disabled when data fails to load.

Screenshot evidence is generated in `test-results/`: `dashboard-desktop.png`, `pokemon-mobile.png`, `trainer-mobile.png`, `battle-mobile.png`, `dashboard-mobile.png`. Desktop dashboard and mobile Battle Lab screenshots were visually inspected. Sprites in these screenshots are deliberately intercepted test placeholders.

## What these results establish

The tests run the actual Express app and browser scripts. The database adapter parses rows from the supplied dump and models the statements used by the API, including composite-key and FK failures. It is an offline test double, **not a MySQL SQL engine**. SQL is not executed against MySQL during tests. Browser sprite requests are intercepted so tests need no image network access. Fixture catches reset at the next test-server start and never change the dump or a real collection. The delivered app itself uses only MySQL, with no fixture fallback.

A first test run incorrectly expected six initial Pokémon for Ash; checking the dump established five. The regression expectation was corrected. Subsequent API and browser runs passed.

## Manual regression checklist with a configured MySQL database

- [ ] Create/edit `.env` using your own credentials, start the server, and confirm `/api/health` returns `{ "status": "ok" }`.
- [ ] Run the optional read-only `database/check-schema.sql` in the intended schema; confirm the seven tables, columns, composite keys, and relationships match the supplied definitions.
- [ ] Compare `/api/pokemon` values with a read-only `SELECT * FROM pokemon`; check the first/last IDs and six stat fields. Counts may differ if your existing data differs.
- [ ] Open each of the four pages directly and navigate to all others. Confirm the active navigation item, footer link, and old URL redirects.
- [ ] Search by name and Pokédex number; combine search/type filters; test a secondary-only type; clear filters; sort by name and total stats; verify empty matches.
- [ ] Inspect Pokémon cards and Battle Lab sprites with external internet access. Confirm names/stats remain usable if image requests fail.
- [ ] Compare two known Pokémon by manually summing their six database stats. Check win, draw, missing-selection, and same-species messages.
- [ ] Select several trainers; compare visible collections with `trainer_pokemon` joined to `pokemon`.
- [ ] On an appropriate test trainer/database, submit one new capture. Confirm one relationship is inserted, the collection refreshes, and the dashboard count increases after Refresh.
- [ ] Reload/restart the app and confirm the real capture persists in MySQL. Attempt the same catch again and confirm the duplicate message with no extra row.
- [ ] If operating read-only, set `ENABLE_CATCHES=false`, restart, and confirm catches are rejected and collections remain unchanged.
- [ ] Compare dashboard counts/grouped types/average stats with SELECT queries in Workbench. Type distribution uses primary type only; average stats are rounded for display.
- [ ] Toggle dark/light on each page, reload, navigate, and verify preference and accessible button label/state. Check a second tab's storage update.
- [ ] Check mobile, tablet, desktop, keyboard focus, and zoom in your preferred browsers. Automated layout coverage is Edge at 320/390/1440px; other engines remain manual.
- [ ] Stop MySQL temporarily in a test environment, or use an unavailable test connection: HTML/navigation should still work and data errors should be visible. Restore the connection and reload.
- [ ] Inspect browser console and server output during live use for unexpected errors; no automated live-database or external-sprite result is claimed.

## Re-running

Use `npm.cmd ci`, then `npm.cmd test`. For browser checks use `npm.cmd run test:browser` with installed Microsoft Edge. To use installed Chrome, set `$env:BROWSER_CHANNEL='chrome'`. Tests do not download browsers or contact MySQL. Screenshot files are generated/ignored artifacts. The final original-source hash test expects the four original sibling folders to remain present; if distributing this app separately, that provenance check requires those original folders or must be run in the original integration workspace.
