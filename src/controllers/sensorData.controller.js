const SensorDataService = require('../services/sensorData.service');
const { validateSensorData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.receiveSensorData = async (req, res) => {
    const { error } = validateSensorData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        await SensorDataService.processSensorData(req.body);

        logger.info('Dữ liệu cảm biến đã được nhận và đang xử lý.', { meta: { request: req.body } });

        res.status(200).json(createResponse('success', 'Dữ liệu đã được nhận và đang xử lý.', 200, []));
    } catch (err) {
        logger.error(`Lỗi khi xử lý dữ liệu cảm biến: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi khi xử lý dữ liệu.', 500, [], err.message));
    }
};
