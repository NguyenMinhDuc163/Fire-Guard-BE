const { getGuidesAndNews } = require('../services/guidesAndNews.service');
const { validateGuidesAndNewsQuery, validateMultipleGuidesAndNewsData} = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const {addMultipleGuidesAndNews} = require('../services/guidesAndNews.service');

exports.getGuidesAndNews = async (req, res) => {
    const { category, limit } = req.query;

    const { error } = validateGuidesAndNewsQuery(req.query);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.query } });
        return res.status(200).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        const data = await getGuidesAndNews(category, limit || 10);
        if (data.length > 0) {
            logger.info('Dữ liệu đã được truy xuất thành công.', { meta: { category, limit, response: data } });
            res.status(200).json(createResponse('success', 'Dữ liệu đã được truy xuất thành công.', 200, data));
        } else {
            logger.warn('Không có dữ liệu phù hợp.', { meta: { category, limit } });
            res.status(200).json(createResponse('fail', 'Không có dữ liệu phù hợp.', 404, []));
        }
    } catch (err) {
        logger.error(`Lỗi khi truy xuất dữ liệu: ${err.message}`, { meta: { request: req.query, error: err } });
        res.status(200).json(createResponse('fail', 'Lỗi khi truy xuất dữ liệu.', 500, [], err.message));
    }
};

exports.addGuidesAndNews = async (req, res) => {
    const { error } = validateMultipleGuidesAndNewsData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(200).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        await addMultipleGuidesAndNews(req.body);

        logger.info('Dữ liệu đã được thêm thành công.', { meta: { request: req.body } });

        res.status(200).json(createResponse('success', 'Dữ liệu đã được thêm thành công.', 200, []));
    } catch (err) {
        logger.error(`Lỗi hệ thống khi thêm dữ liệu: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(200).json(createResponse('fail', 'Lỗi hệ thống khi thêm dữ liệu.', 500, [], err.message));
    }
};
