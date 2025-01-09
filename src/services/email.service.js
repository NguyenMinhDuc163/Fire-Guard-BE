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
        from: '"Your App" <no-reply@example.com>',
        to: email,
        subject: 'Đặt lại mật khẩu',
        text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết sau để tiếp tục: ${resetLink}`,
        html: `<p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết sau để tiếp tục:</p>
               <a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);
};
