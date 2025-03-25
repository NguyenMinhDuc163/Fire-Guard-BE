const EmergencyModel = require('../models/emergency.model');
const axios = require('axios');
const pool = require('../configs/db.config');


const callFireDepartment = async (data, phoneNumber, family_member_id) => {
    // lay api tu db
    const query = `SELECT users.click_send_key, users.click_send_name, users.alert_phone FROM users WHERE users.id = $1`;
    const result = await pool.query(query, [family_member_id]);

    if (result.rows.length === 0) {
        console.log("Không tìm thấy thông tin người thân");
        throw new Error('Không tìm thấy thông tin người thân');
    }

    const clickSendKey = result.rows[0].click_send_key;
    const clickSendName = result.rows[0].click_send_name;
    const alertPhone = result.rows[0].alert_phone;

    // Lưu thông tin vào cơ sở dữ liệu trước khi gọi API
    await EmergencyModel.save({
        location: data.location,
        phone_number: alertPhone,
        incident_details: data.incident_details,
        status: 'pending',  // Trạng thái ban đầu trước khi gửi thông báo
        response_message: 'Đang gửi thông báo đến lực lượng cứu hỏa.'
    });

    const messageBody = {
        messages: [
            {
                to: alertPhone,
                body: `Cảnh báo sự cố tại ${data.location}. Chi tiết: ${data.incident_details}.`,
            },
        ],
    };
    console.log(`fasfsf1 ${clickSendName} ${clickSendKey}`);
    console.log(`gthgfd2 ${process.env.API_USERNAME} ${process.env.API_KEY}`);
    console.log('DB Key length:', clickSendKey.length);
    console.log('DB Key type:', typeof clickSendKey);
    console.log('ENV Key length:', process.env.API_KEY.length);
    console.log('ENV Key type:', typeof process.env.API_KEY);
    // Gửi thông báo qua ClickSend API
    const response = await axios.post('https://rest.clicksend.com/v3/voice/send', messageBody, {
        auth: {
            username: clickSendName.trim().toString(),
            password: clickSendKey.trim().toString() ,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log('Đã gửi thông báo đến lực lượng cứu hỏa:', response.data);

    return response.data;
};

module.exports = {
    callFireDepartment,
};
