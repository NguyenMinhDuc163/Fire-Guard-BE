const SensorDataModel = require('../models/sensorData.model');

const saveSensorData = async (data) => {
        await SensorDataModel.save(data);
};

module.exports = {
    saveSensorData,
};
