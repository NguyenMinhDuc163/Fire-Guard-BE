// fireAlarm.model.js
const pool = require('../configs/db.config');

const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fire_alarms (
                id SERIAL PRIMARY KEY,
                location VARCHAR(100),
                status BOOLEAN,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Fire alarms table created successfully!");
    } catch (err) {
        console.error("Error creating fire alarms table", err);
    }
};

createTable();

module.exports = pool;
