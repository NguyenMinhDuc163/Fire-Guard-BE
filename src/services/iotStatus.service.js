const pool = require('../configs/db.config');

const getIotStatus = async () => {
        
    const query = `
    SELECT device_name, status
    FROM iot_devices_status
    WHERE device_name IN ('flame_sensor', 'mq2_sensor', 'mq135_sensor', 'buzzer');
  `;

    const result = await pool.query(query);
    const statusMap = {};

        result.rows.forEach(row => {
        statusMap[row.device_name] = row.status;
    });

    return statusMap;
};

module.exports = {
    getIotStatus,
};
