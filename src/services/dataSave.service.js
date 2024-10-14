const SensorDataModel = require('../models/sensorData.model');

const saveSensorData = async (data) => {
    // Bạn có thể thêm logic xử lý dữ liệu nếu cần
    await SensorDataModel.save(data);
};

module.exports = {
    saveSensorData,
};
