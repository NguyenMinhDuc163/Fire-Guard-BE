const { saveSensorData } = require('../services/dataSave.service');
const { validateSensorData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.saveSensorData = async (req, res) => {
    const { error } = validateSensorData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, null, error.details[0].message));
    }

    try {
        await saveSensorData(req.body);

        const responseData = [{ a: '99999' }];
        logger.info('Dữ liệu đã được lưu thành công.', { meta: { request: req.body, response: responseData } });

        res.status(200).json(createResponse('success', 'Dữ liệu đã được lưu thành công.', 200, responseData));
    } catch (err) {
        logger.error(`Lỗi khi lưu trữ dữ liệu: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi khi lưu trữ dữ liệu.', 500, null, err.message));
    }
};
