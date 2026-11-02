const mysql = require('mysql2/promise');
function createDatabase(env = process.env) {
  const required = ['DBHOST', 'DBUSER', 'DBDATABASE'];
  if (required.some(key => !env[key])) {
    return { execute: async () => { throw new Error('Database configuration missing'); }, end: async () => {} };
  }
  return mysql.createPool({
    host: env.DBHOST, port: Number(env.DBPORT || 3306), user: env.DBUSER,
    password: env.DBPASSWORD || '', database: env.DBDATABASE,
    waitForConnections: true, connectionLimit: 5, connectTimeout: 5000,
    multipleStatements: false
  });
}
module.exports = { createDatabase };
