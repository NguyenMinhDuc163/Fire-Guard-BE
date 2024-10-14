const pool = require('../configs/db.config');

class FamilyNotificationModel {
    static async save(data) {
        const query = `
      INSERT INTO family_notifications (user_id, family_member_id, message, timestamp)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [
            data.user_id,
            data.family_member_id,
            data.message,
            data.timestamp,
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = FamilyNotificationModel;
