// models/notificationsModel.js
const db = require('../configs/db.config');

exports.insertNotification = async (data) => {
    const { user_id, message, timestamp } = data;
    const query = `
    INSERT INTO notifications (user_id, message, timestamp)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
    const values = [user_id, message, timestamp];
    const result = await db.query(query, values);
    return result.rows[0];
};
