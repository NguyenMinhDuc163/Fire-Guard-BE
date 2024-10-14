const { saveMultipleIotStatus } = require('../services/iotStatusSave.service');
const { validateMultipleIotStatusData } = require('../utils/validation');

exports.saveIotStatus = async (req, res) => {
    const { error } = validateMultipleIotStatusData(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        await saveMultipleIotStatus(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Trạng thái của các thiết bị đã được lưu thành công.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi hệ thống khi lưu trạng thái thiết bị.',
            error: err.message,
        });
    }
};
