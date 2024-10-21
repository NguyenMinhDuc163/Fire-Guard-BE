const EmergencyModel = require('../models/emergency.model');
const axios = require('axios');

const callFireDepartment = async (data, phoneNumber) => {
    await EmergencyModel.save(data); // Lưu thông tin vào cơ sở dữ liệu

    const messageBody = {
        messages: [
            {
                to: phoneNumber,
                body: `Cảnh báo sự cố tại ${data.location}. Chi tiết: ${data.incident_details}.`,
            },
        ],
    };

    // Gửi thông báo qua ClickSend API
    const response = await axios.post('https://rest.clicksend.com/v3/voice/send', messageBody, {
        auth: {
            username: process.env.API_USERNAME,
            password: process.env.API_KEY,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log('Đã gửi thông báo đến lực lượng cứu hỏa:', response.data);
};

module.exports = {
    callFireDepartment,
};
