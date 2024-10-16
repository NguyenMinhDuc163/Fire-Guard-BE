const { callFireDepartment } = require('../services/emergency.service');
const { validateEmergencyData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); 
exports.callFireDepartment = async (req, res) => {
        const { error } = validateEmergencyData(req.body);
    if (error) {
                return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
                await callFireDepartment(req.body);

                res.status(200).json(createResponse('success', 'Lực lượng cứu hỏa đã được thông báo.', 200, []));
    } catch (err) {
                res.status(500).json(createResponse('fail', 'Lỗi hệ thống.', 500, [], err.message));
    }
};
