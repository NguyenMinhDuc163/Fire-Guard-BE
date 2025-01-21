const nodemailer = require('nodemailer');

exports.sendResetEmail = async (email, resetLink) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true nếu dùng SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: '"Support Team - Fire Guard" <no-reply@example.com>', // Tên hiển thị trong email
        to: email,
        subject: 'Yêu cầu đặt lại mật khẩu',
        text: `Xin chào,

Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.

Để đặt lại mật khẩu, hãy nhấn vào liên kết sau:
${resetLink}

Liên kết này sẽ hết hạn sau 15 phút.

Trân trọng,
Đội ngũ hỗ trợ - Fire Guard`,
        html: `
            <p>Xin chào,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            <p>Để đặt lại mật khẩu, hãy nhấn vào liên kết sau:</p>
            <p><a href="${resetLink}" style="color: #007bff; text-decoration: none;">Đặt lại mật khẩu</a></p>
            <p style="font-size: 12px; color: #555;">(Liên kết này sẽ hết hạn sau 15 phút.)</p>
            <p>Trân trọng,</p>
            <p><strong>Đội ngũ hỗ trợ - Your App</strong></p>
        `,
    };

    await transporter.sendMail(mailOptions);
};
