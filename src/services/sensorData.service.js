const SensorDataModel = require('../models/sensorData.model');

const processSensorData = async (data) => {
    // Xử lý dữ liệu nếu cần thiết
    await SensorDataModel.save(data);
};

module.exports = {
    processSensorData,
};
