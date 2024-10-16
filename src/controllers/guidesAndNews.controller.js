const { getGuidesAndNews } = require('../services/guidesAndNews.service');
const { validateGuidesAndNewsQuery } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); 
exports.getGuidesAndNews = async (req, res) => {
    const { category, limit } = req.query;

        const { error } = validateGuidesAndNewsQuery(req.query);
    if (error) {
                return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
                const data = await getGuidesAndNews(category, limit || 10);         if (data.length > 0) {
                        res.status(200).json(createResponse('success', 'Dữ liệu đã được truy xuất thành công.', 200, data));
        } else {
                        res.status(404).json(createResponse('fail', 'Không có dữ liệu phù hợp.', 404, []));
        }
    } catch (err) {
                res.status(500).json(createResponse('fail', 'Lỗi khi truy xuất dữ liệu.', 500, [], err.message));
    }
};
