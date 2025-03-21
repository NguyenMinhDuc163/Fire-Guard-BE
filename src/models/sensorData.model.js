const pool = require('../configs/db.config');

class SensorDataModel {
    static async save(data) {
        const query = `
            INSERT INTO sensor_data (device_id, flame_sensor, mq2_gas_level, mq135_air_quality, buzzer_status, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            data.device_id,
            data.flame_sensor,
            data.mq2_gas_level,
            data.mq135_air_quality,
            data.buzzer_status, // Thêm giá trị cho buzzer_status
            data.timestamp,
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = SensorDataModel;
