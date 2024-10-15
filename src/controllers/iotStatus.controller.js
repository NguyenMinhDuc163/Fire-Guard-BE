const { getIotStatus } = require('../services/iotStatus.service');
const { createResponse } = require('../utils/responseHelper'); // Import helper

exports.checkIotStatus = async (req, res) => {
    try {
        // Lấy trạng thái hệ thống IoT từ service
        const iotStatus = await getIotStatus();

        // Trả về phản hồi thành công với code 200 và dữ liệu iotStatus
        res.status(200).json(createResponse('success', 'Trạng thái IoT đã được truy xuất thành công.', 200, iotStatus));
    } catch (err) {
        // Trả về phản hồi lỗi với code 500 nếu có lỗi hệ thống
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống.', 500, [], err.message));
    }
};
