// fireAlarm.service.js
const pool = require('../models/fireAlarm.model');

// Lấy danh sách tất cả các thiết bị báo cháy
exports.getAllFireAlarms = async () => {
    const result = await pool.query('SELECT * FROM fire_alarms');
    return result.rows;
};

// Thêm một thiết bị báo cháy mới
exports.addFireAlarm = async (location, status) => {
    const result = await pool.query(
        'INSERT INTO fire_alarms (location, status) VALUES ($1, $2) RETURNING *',
        [location, status]
    );
    return result.rows[0];
};
