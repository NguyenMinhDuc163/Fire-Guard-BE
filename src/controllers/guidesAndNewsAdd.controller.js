const { addMultipleGuidesAndNews } = require('../services/guidesAndNewsAdd.service');
const { validateMultipleGuidesAndNewsData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper để tạo response chuẩn

exports.addGuidesAndNews = async (req, res) => {
    // Validate dữ liệu đầu vào
    const { error } = validateMultipleGuidesAndNewsData(req.body);
    if (error) {
        // Trả về phản hồi lỗi với code 400 và thông báo lỗi chi tiết
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Thêm dữ liệu vào cơ sở dữ liệu
        await addMultipleGuidesAndNews(req.body);

        // Trả về phản hồi thành công với code 200
        res.status(200).json(createResponse('success', 'Dữ liệu đã được thêm thành công.', 200, []));
    } catch (err) {
        // Trả về phản hồi lỗi với code 500 nếu có lỗi hệ thống
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống khi thêm dữ liệu.', 500, [], err.message));
    }
};
