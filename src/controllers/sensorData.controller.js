const SensorDataService = require('../services/sensorData.service');
const { validateSensorData } = require('../utils/validation');

exports.receiveSensorData = async (req, res) => {
    const { error } = validateSensorData(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }
    try {
        await SensorDataService.processSensorData(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Dữ liệu đã được nhận và đang xử lý.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
