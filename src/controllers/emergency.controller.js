const { callFireDepartment } = require('../services/emergency.service');
const { validateEmergencyData } = require('../utils/validation');

exports.callFireDepartment = async (req, res) => {
    const { error } = validateEmergencyData(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        await callFireDepartment(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Lực lượng cứu hỏa đã được thông báo.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi hệ thống.',
            error: err.message,
        });
    }
};
