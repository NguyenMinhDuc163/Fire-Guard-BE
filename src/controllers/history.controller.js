const { getHistory } = require('../services/history.service');
const { validateHistoryRequest } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.getHistory = async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    const { error } = validateHistoryRequest(req.query);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.query } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        const history = await getHistory(user_id, start_date, end_date);
        if (history.length > 0) {
            logger.info('Lịch sử đã được truy xuất thành công.', { meta: { user_id, start_date, end_date, response: history } });
            res.status(200).json(createResponse('success', 'Lịch sử đã được truy xuất thành công.', 200, history));
        } else {
            logger.warn('Không tìm thấy lịch sử.', { meta: { user_id, start_date, end_date } });
            res.status(200).json(createResponse('fail', 'Không tìm thấy lịch sử.', 200, []));
        }
    } catch (err) {
        logger.error(`Lỗi khi truy xuất lịch sử: ${err.message}`, { meta: { request: req.query, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi khi truy xuất lịch sử.', 500, [], err.message));
    }
};