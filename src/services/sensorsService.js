// services/sensorsService.js
const sensorsModel = require('../models/sensorsModel');

exports.receiveSensorData = async (data) => {
    // Xử lý logic nghiệp vụ (nếu cần)
    const insertedData = await sensorsModel.insertSensorData(data);
    return insertedData;
};
