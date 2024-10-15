const SensorDataService = require('../services/sensorData.service');
const { validateSensorData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper để tạo phản hồi chuẩn

exports.receiveSensorData = async (req, res) => {
    // Validate dữ liệu đầu vào từ request body
    const { error } = validateSensorData(req.body);
    if (error) {
        // Trả về phản hồi lỗi với mã 400 và thông tin lỗi chi tiết
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Xử lý dữ liệu cảm biến
        await SensorDataService.processSensorData(req.body);

        // Trả về phản hồi thành công với mã 200
        res.status(200).json(createResponse('success', 'Dữ liệu đã được nhận và đang xử lý.', 200, []));
    } catch (err) {
        // Trả về phản hồi lỗi với mã 500 nếu có lỗi hệ thống
        res.status(500).json(createResponse('fail', 'Lỗi khi xử lý dữ liệu.', 500, [], err.message));
    }
};
