const EmergencyModel = require('../models/emergency.model');

const callFireDepartment = async (data) => {
    // Lưu thông tin sự cố vào cơ sở dữ liệu
    await EmergencyModel.save(data);

    // Gửi thông báo đến lực lượng cứu hỏa (giả lập)
    // Bạn có thể tích hợp với API của lực lượng cứu hỏa nếu có
    console.log('Gửi thông báo đến lực lượng cứu hỏa:', data);
};

module.exports = {
    callFireDepartment,
};
