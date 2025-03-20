// const { addMultipleGuidesAndNews } = require('../services/guidesAndNewsAdd.service');
// const { validateMultipleGuidesAndNewsData } = require('../utils/validation');
// const { createResponse } = require('../utils/responseHelper');
// const { logger } = require('../utils/logger');
//
// exports.addGuidesAndNews = async (req, res) => {
//     const { error } = validateMultipleGuidesAndNewsData(req.body);
//     if (error) {
//         logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
//         return res.status(200).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
//     }
//
//     try {
//         await addMultipleGuidesAndNews(req.body);
//
//         logger.info('Dữ liệu đã được thêm thành công.', { meta: { request: req.body } });
//
//         res.status(200).json(createResponse('success', 'Dữ liệu đã được thêm thành công.', 200, []));
//     } catch (err) {
//         logger.error(`Lỗi hệ thống khi thêm dữ liệu: ${err.message}`, { meta: { request: req.body, error: err } });
//         res.status(200).json(createResponse('fail', 'Lỗi hệ thống khi thêm dữ liệu.', 500, [], err.message));
//     }
// };
