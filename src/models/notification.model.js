const pool = require('../configs/db.config');

class NotificationModel {
    static async save(data) {
        const query = `
      INSERT INTO notifications (user_id, message, timestamp)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const values = [data.user_id, data.message, data.timestamp];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = NotificationModel;
