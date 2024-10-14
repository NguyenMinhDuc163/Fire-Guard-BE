const pool = require('../configs/db.config');

const getIotStatus = async () => {
    // Truy vấn trạng thái của các thiết bị từ cơ sở dữ liệu hoặc các nguồn dữ liệu khác
    // Ở đây, chúng ta giả định dữ liệu được lấy từ bảng `iot_devices_status`

    const query = `
    SELECT device_name, status
    FROM iot_devices_status
    WHERE device_name IN ('flame_sensor', 'mq2_sensor', 'mq135_sensor', 'buzzer');
  `;

    const result = await pool.query(query);
    const statusMap = {};

    // Xử lý dữ liệu trả về để tạo thành object trạng thái
    result.rows.forEach(row => {
        statusMap[row.device_name] = row.status;
    });

    return statusMap;
};

module.exports = {
    getIotStatus,
};
