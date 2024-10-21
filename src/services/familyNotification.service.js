const axios = require('axios');

const notifyFamilyMember = async (data, phoneNumber) => {
    const { API_USERNAME, API_KEY } = process.env;

    const messageBody = {
        messages: [
            {
                to: phoneNumber,
                body: data.message,
            },
        ],
    };

    const response = await axios.post('https://rest.clicksend.com/v3/voice/send', messageBody, {
        auth: {
            username: API_USERNAME,
            password: API_KEY,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log('Thông báo đã gửi đến người thân:', response.data);
};

module.exports = {
    notifyFamilyMember,
};
