const SensorDataService = require('../services/sensorData.service');
const { validateSensorData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); 
exports.receiveSensorData = async (req, res) => {
        const { error } = validateSensorData(req.body);
    if (error) {
                return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
                await SensorDataService.processSensorData(req.body);

                res.status(200).json(createResponse('success', 'Dữ liệu đã được nhận và đang xử lý.', 200, []));
    } catch (err) {
                res.status(500).json(createResponse('fail', 'Lỗi khi xử lý dữ liệu.', 500, [], err.message));
    }
};
