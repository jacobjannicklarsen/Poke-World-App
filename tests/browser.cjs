const { chromium } = require('playwright');
const { createApp } = require('../server/app');
const { fixtureDatabase } = require('./fixture-db.cjs');
const { once } = require('node:events');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  const database = fixtureDatabase();
  const server = createApp(database).listen(0, '127.0.0.1');
  await once(server, 'listening');
  let browser;
  try {
    // Use an already-installed browser; this test never downloads a browser.
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
    const base = `http://127.0.0.1:${server.address().port}`;
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    // Images are external decoration. Keep this suite deterministic and offline.
    await context.route('https://raw.githubusercontent.com/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="35" fill="#80e5b8"/></svg>' }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    async function status(text) { await page.locator('#page-status').filter({ hasText: text }).waitFor(); }
    await page.goto(base + '/pokemon.html');
    await status('151 of 151');
    assert.equal(await page.locator('#pokemon-grid .pokemon-card').count(), 151);
    await page.locator('#search').fill('Pikachu'); await status('1 of 151');
    assert.equal(await page.locator('#pokemon-grid h2').textContent(), 'Pikachu');
    await page.locator('#search').fill('doesnotexist'); await status('No Pokémon');
    await page.locator('#search').fill('');
    await page.locator('#type-filter').selectOption('Flying');
    await page.locator('#pokemon-grid h2').filter({ hasText: /^Charizard$/ }).waitFor();
    await page.locator('#sort').selectOption('total');
    assert.equal(await page.locator('#pokemon-grid h2').first().textContent(), 'Dragonite');
    await page.locator('#type-filter').selectOption('');
    assert.equal(await page.locator('#pokemon-grid h2').first().textContent(), 'Mewtwo');
    await page.locator('#theme-toggle').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    assert.equal(await page.locator('#theme-toggle').getAttribute('aria-pressed'), 'true');
    for (const from of ['pokemon', 'trainer', 'battle', 'dashboard']) {
      for (const to of ['pokemon', 'trainer', 'battle', 'dashboard']) {
        await page.goto(`${base}/${from}.html`);
        await page.locator(`.main-nav a[href="${to}.html"]`).click();
        assert.equal(new URL(page.url()).pathname, `/${to}.html`);
        assert.equal(await page.locator('.main-nav [aria-current="page"]').getAttribute('href'), `${to}.html`);
      }
    }
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.goto(base + '/battle.html');
    await page.locator('#pokemon1 option[value="1"]').waitFor({ state: 'attached' });
    await page.locator('#battle-button').click();
    assert.equal(await page.locator('#battle-result').textContent(), 'Please select two Pokémon!');
    await page.locator('#pokemon1').selectOption('1'); await page.locator('#pokemon2').selectOption('1');
    await page.locator('#battle-button').click();
    assert.equal(await page.locator('#battle-result').textContent(), 'Choose two different Pokémon!');
    await page.locator('#pokemon2').selectOption('6'); await page.locator('#battle-button').click();
    assert.ok((await page.locator('#battle-result').textContent()).includes('Charizard (534) defeats Bulbasaur (318)'));
    assert.ok(await page.locator('#pokemon2-card').evaluate(el => el.classList.contains('winner')));
    await page.locator('#pokemon1').selectOption('151'); await page.locator('#pokemon2').selectOption('149'); await page.locator('#battle-button').click();
    assert.ok((await page.locator('#battle-result').textContent()).includes('Draw!'));
    assert.equal(await page.locator('.winner').count(), 0);
    await page.goto(base + '/trainer.html'); await status('Choose a trainer');
    await page.locator('#trainer').selectOption('1'); await status('5 Pokémon');
    await page.locator('#catch-pokemon').selectOption('7'); await page.locator('#catch-button').click(); await status('Pokémon caught!');
    assert.equal(await page.locator('#trainer-team .pokemon-card').count(), 6);
    await page.reload(); await status('Choose a trainer'); await page.locator('#trainer').selectOption('1'); await status('6 Pokémon');
    await page.locator('#catch-pokemon').selectOption('7'); await page.locator('#catch-button').click(); await status('already caught');
    await page.goto(base + '/dashboard.html'); await status('Statistics updated');
    assert.equal(await page.locator('#count-catches').textContent(), '21');
    assert.equal(await page.locator('#count-pokemon').textContent(), '151');
    assert.equal(await page.locator('#stat-chart meter').count(), 6);
    await page.locator('#refresh').click(); await status('Statistics updated');
    const results = path.join(__dirname, '../test-results'); fs.mkdirSync(results, { recursive: true });
    await page.screenshot({ path: path.join(results, 'dashboard-desktop.png'), fullPage: true });
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      for (const name of ['pokemon', 'trainer', 'battle', 'dashboard']) {
        await page.goto(`${base}/${name}.html`);
        if (name === 'pokemon') await status('151 of 151');
        if (name === 'trainer') await status('Choose a trainer');
        if (name === 'dashboard') await status('Statistics updated');
        if (name === 'battle') {
          await page.locator('#pokemon1 option[value="1"]').waitFor({ state: 'attached' });
          await page.locator('#pokemon1').selectOption('1'); await page.locator('#pokemon2').selectOption('6'); await page.locator('#battle-button').click();
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} overflows at ${width}px`);
        if (width === 390) await page.screenshot({ path: path.join(results, `${name}-mobile.png`), fullPage: name !== 'pokemon' });
      }
    }
    await page.route('**/api/pokemon', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Database unavailable.' }) }));
    await page.goto(base + '/pokemon.html'); await status('Database unavailable');
    assert.equal(await page.locator('#page-status').getAttribute('data-error'), 'true');
    await page.goto(base + '/battle.html');
    await page.locator('#battle-result').filter({ hasText: 'Database unavailable' }).waitFor();
    assert.ok(await page.locator('#battle-button').isDisabled());
    assert.deepEqual(errors, [], 'Browser JavaScript errors');
    console.log('PASS: browser integration (151 Pokémon, all 16 navigation paths, filters/sort, theme persistence, battle/winner/draw, catch/duplicate/reload, dashboard, 320px/390px layouts, API failures).');
    console.log('Database: offline fixture adapter; sprites: intercepted. No real MySQL writes or external image availability verified.');
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
