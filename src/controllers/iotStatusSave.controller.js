const { saveMultipleIotStatus } = require('../services/iotStatusSave.service');
const { validateMultipleIotStatusData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.saveIotStatus = async (req, res) => {
    const { error } = validateMultipleIotStatusData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        await saveMultipleIotStatus(req.body);

        logger.info('Trạng thái của các thiết bị đã được lưu thành công.', { meta: { request: req.body } });

        res.status(200).json(createResponse('success', 'Trạng thái của các thiết bị đã được lưu thành công.', 200, []));
    } catch (err) {
        logger.error(`Lỗi hệ thống khi lưu trạng thái thiết bị: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống khi lưu trạng thái thiết bị.', 500, [], err.message));
    }
};
