const SensorDataModel = require('../models/sensorData.model');

const processSensorData = async (data) => {
        await SensorDataModel.save(data);
};

module.exports = {
    processSensorData,
};
