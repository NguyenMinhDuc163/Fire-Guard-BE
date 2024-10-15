const { getHistory } = require('../services/history.service');
const { validateHistoryRequest } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper để tạo response chuẩn

exports.getHistory = async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    // Validate dữ liệu từ query
    const { error } = validateHistoryRequest(req.query);
    if (error) {
        // Trả về phản hồi lỗi với code 400
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Lấy lịch sử từ service
        const history = await getHistory(user_id, start_date, end_date);
        if (history.length > 0) {
            // Trả về phản hồi thành công với code 200 và dữ liệu
            res.status(200).json(createResponse('success', 'Lịch sử đã được truy xuất thành công.', 200, history));
        } else {
            // Trả về phản hồi lỗi với code 404 nếu không có lịch sử
            res.status(404).json(createResponse('fail', 'Không tìm thấy lịch sử.', 404, []));
        }
    } catch (err) {
        // Trả về phản hồi lỗi với code 500 nếu có lỗi hệ thống
        res.status(500).json(createResponse('fail', 'Lỗi khi truy xuất lịch sử.', 500, [], err.message));
    }
};
