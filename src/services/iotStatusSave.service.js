const pool = require('../configs/db.config');

const saveMultipleIotStatus = async (devices) => {
    const query = `
    INSERT INTO iot_devices_status (device_name, status, timestamp)
    VALUES ($1, $2, $3)
    ON CONFLICT (device_name) DO UPDATE
    SET status = EXCLUDED.status, timestamp = EXCLUDED.timestamp
    RETURNING *;
  `;

    for (let device of devices) {
        const { device_name, status, timestamp } = device;
        const values = [device_name, status, timestamp];
        await pool.query(query, values);
    }
};

module.exports = {
    saveMultipleIotStatus,
};
