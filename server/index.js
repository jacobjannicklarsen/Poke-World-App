const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });
const { createDatabase } = require('./db');
const { createApp } = require('./app');
const database = createDatabase();
const app = createApp(database, { enableCatches: process.env.ENABLE_CATCHES !== 'false' });
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, '127.0.0.1');
server.once('listening', () => console.log(`Poke World: http://localhost:${server.address().port}`));
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Stop the existing server or choose another PORT in .env.`
    : `Server could not start (${error.code || 'unknown error'}).`);
  process.exitCode = 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  server.close(async () => { await database.end(); process.exit(0); });
});
