const pool = require('../configs/db.config');

const convertDateToTimestamp = (dateString, isEndOfDay = false) => {
    const date = new Date(dateString);

    if (isEndOfDay) {
                date.setHours(23, 59, 59, 999);
    } else {
                date.setHours(0, 0, 0, 0);
    }

    return date.toISOString(); };

const getHistory = async (user_id, start_date, end_date) => {
    let query = `
    SELECT id AS incident_id, message, timestamp
    FROM notifications
    WHERE user_id = $1
  `;
    const values = [user_id];

        if (start_date && end_date) {
        const startTimestamp = convertDateToTimestamp(start_date);
        const endTimestamp = convertDateToTimestamp(end_date, true);         query += ` AND timestamp BETWEEN $2 AND $3`;
        values.push(startTimestamp, endTimestamp);
    }

    query += ` ORDER BY timestamp DESC;`;

    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = {
    getHistory,
};
