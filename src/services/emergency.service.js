const EmergencyModel = require('../models/emergency.model');

const callFireDepartment = async (data) => {
        await EmergencyModel.save(data);

            console.log('Gửi thông báo đến lực lượng cứu hỏa:', data);
};

module.exports = {
    callFireDepartment,
};
