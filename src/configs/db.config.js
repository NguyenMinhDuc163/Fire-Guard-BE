// configs/db.config.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log('Đã kết nối tới cơ sở dữ liệu PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Lỗi kết nối cơ sở dữ liệu', err);
    process.exit(-1);
});

module.exports = pool;
