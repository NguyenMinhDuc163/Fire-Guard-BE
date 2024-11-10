const pool = require('../configs/db.config');

const saveMultipleIotStatus = async (devices) => {
    const query = `
    INSERT INTO iot_devices_status (device_name, status, timestamp)
    VALUES ($1, $2, $3)
    ON CONFLICT (device_name) DO UPDATE
    SET status = EXCLUDED.status, timestamp = EXCLUDED.timestamp
    RETURNING *;
  `;

    const updatedDevices = [];

    for (let device of devices) {
        const { device_name, status, timestamp } = device;
        const values = [device_name, status, timestamp];
        const result = await pool.query(query, values);
        updatedDevices.push(result.rows[0]); // Lưu kết quả cập nhật của từng thiết bị
    }

    return updatedDevices; // Trả về danh sách các thiết bị đã cập nhật
};

module.exports = {
    saveMultipleIotStatus,
};
