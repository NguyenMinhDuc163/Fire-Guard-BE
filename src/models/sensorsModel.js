// models/sensorsModel.js
const db = require('../configs/db.config');

exports.insertSensorData = async (data) => {
    const { device_id, flame_sensor, mq2_gas_level, mq135_air_quality, timestamp } = data;
    const query = `
    INSERT INTO sensor_data (device_id, flame_sensor, mq2_gas_level, mq135_air_quality, timestamp)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [device_id, flame_sensor, mq2_gas_level, mq135_air_quality, timestamp];
    const result = await db.query(query, values);
    return result.rows[0];
};
