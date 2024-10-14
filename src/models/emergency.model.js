const pool = require('../configs/db.config');

class EmergencyModel {
    static async save(data) {
        const query = `
      INSERT INTO emergency_calls (location, incident_details, timestamp)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const values = [data.location, data.incident_details, data.timestamp];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = EmergencyModel;
