const { getGuidesAndNews } = require('../services/guidesAndNews.service');
const { validateGuidesAndNewsQuery } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper

exports.getGuidesAndNews = async (req, res) => {
    const { category, limit } = req.query;

    // Validate dữ liệu từ query
    const { error } = validateGuidesAndNewsQuery(req.query);
    if (error) {
        // Trả về phản hồi lỗi với code 400
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Lấy dữ liệu guides và news từ service
        const data = await getGuidesAndNews(category, limit || 10); // Mặc định limit là 10
        if (data.length > 0) {
            // Trả về phản hồi thành công với code 200 và dữ liệu
            res.status(200).json(createResponse('success', 'Dữ liệu đã được truy xuất thành công.', 200, data));
        } else {
            // Trả về phản hồi lỗi với code 404 nếu không có dữ liệu phù hợp
            res.status(404).json(createResponse('fail', 'Không có dữ liệu phù hợp.', 404, []));
        }
    } catch (err) {
        // Trả về phản hồi lỗi với code 500 nếu có lỗi hệ thống
        res.status(500).json(createResponse('fail', 'Lỗi khi truy xuất dữ liệu.', 500, [], err.message));
    }
};
