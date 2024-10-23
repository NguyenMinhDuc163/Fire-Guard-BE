const { getIotStatus } = require('../services/iotStatus.service');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.checkIotStatus = async (req, res) => {
    try {
        const iotStatus = await getIotStatus();

        logger.info('Trạng thái IoT đã được truy xuất thành công.', { meta: { response: iotStatus } });

        res.status(200).json(createResponse('success', 'Trạng thái IoT đã được truy xuất thành công.', 200, iotStatus));
    } catch (err) {
        logger.error(`Lỗi hệ thống khi truy xuất trạng thái IoT: ${err.message}`, { meta: { error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống.', 500, [], err.message));
    }
};
