const { Pool } = require('pg');      // PostgreSQL
const mysql = require('mysql2/promise');  // MySQL
require('dotenv').config();

// Hàm để tạo kết nối linh hoạt
let db;

if (process.env.DB_TYPE === 'postgres') {
    // Kết nối PostgreSQL
    db = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    console.log('Connected to PostgreSQL');
} else if (process.env.DB_TYPE === 'mysql') {
    // Kết nối MySQL
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    console.log('Connected to MySQL');
} else {
    throw new Error('Unsupported DB_TYPE. Please use "postgres" or "mysql".');
}

module.exports = db;
