const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'event_booking',
  password: '30122004', 
  port: 5432,
});

module.exports = pool;