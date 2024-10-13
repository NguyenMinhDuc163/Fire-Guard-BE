// const express = require('express');
// const app = express();
//
// app.use(express.urlencoded({ extended: true }));
// // Sử dụng middleware để parse dữ liệu JSON
// app.use(express.json());
//
// app.post('/api/data', (req, res) => {
//     // In ra toàn bộ req.body để kiểm tra
//     console.log('Dữ liệu nhận được:', req.body);
//
//     // Lấy giá trị gas và flame từ req.body
//     const { gas, flame } = req.body;
//
//     // Kiểm tra xem gas và flame có tồn tại không
//     if (gas !== undefined && flame !== undefined) {
//         console.log(`Nhận được dữ liệu - GAS: ${gas}, FLAME: ${flame}`);
//         res.status(200).send('Đã nhận dữ liệu');
//     } else {
//         console.log('Dữ liệu nhận được không hợp lệ.');
//         res.status(400).send('Dữ liệu không hợp lệ');
//     }
// });
//
// // Khởi động server
// const PORT = 3000;
// const IP = '0.0.0.0'; // Để lắng nghe trên tất cả các địa chỉ IP
// app.listen(PORT, IP, () => {
//     console.log(`Server đang chạy trên cổng ${PORT}`);
// });


// server.js
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Máy chủ đang chạy trên cổng ${port}`);
});
