const { saveMultipleIotStatus } = require('../services/iotStatusSave.service');
const { validateMultipleIotStatusData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper để tạo phản hồi chuẩn

exports.saveIotStatus = async (req, res) => {
    // Validate dữ liệu đầu vào từ request body
    const { error } = validateMultipleIotStatusData(req.body);
    if (error) {
        // Trả về phản hồi lỗi với mã 400 và thông tin lỗi chi tiết
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Lưu trạng thái thiết bị IoT
        await saveMultipleIotStatus(req.body);

        // Trả về phản hồi thành công với mã 200
        res.status(200).json(createResponse('success', 'Trạng thái của các thiết bị đã được lưu thành công.', 200, []));
    } catch (err) {
        // Trả về phản hồi lỗi với mã 500 nếu có lỗi hệ thống
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống khi lưu trạng thái thiết bị.', 500, [], err.message));
    }
};
