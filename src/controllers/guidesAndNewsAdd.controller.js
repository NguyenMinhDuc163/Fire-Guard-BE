const { addMultipleGuidesAndNews } = require('../services/guidesAndNewsAdd.service');
const { validateMultipleGuidesAndNewsData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); 
exports.addGuidesAndNews = async (req, res) => {
        const { error } = validateMultipleGuidesAndNewsData(req.body);
    if (error) {
                return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
                await addMultipleGuidesAndNews(req.body);

                res.status(200).json(createResponse('success', 'Dữ liệu đã được thêm thành công.', 200, []));
    } catch (err) {
                res.status(500).json(createResponse('fail', 'Lỗi hệ thống khi thêm dữ liệu.', 500, [], err.message));
    }
};
