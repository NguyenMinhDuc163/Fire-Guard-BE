const express = require('express');
const app = express();

// Sử dụng middleware để parse dữ liệu x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Sử dụng middleware để parse dữ liệu JSON
app.use(express.json());

// API nhận dữ liệu từ client (Postman hoặc ESP8266)
app.post('/api/data', (req, res) => {
    // In ra toàn bộ req.body để kiểm tra
    console.log('Dữ liệu nhận được:', req.body);

    // Lấy giá trị gas và flame từ req.body
    const { gas, flame } = req.body;

    // Kiểm tra xem gas và flame có tồn tại không
    if (gas !== undefined && flame !== undefined) {
        console.log(`Nhận được dữ liệu - GAS: ${gas}, FLAME: ${flame}`);
        res.status(200).send('Đã nhận dữ liệu');
    } else {
        console.log('Dữ liệu nhận được không hợp lệ.');
        res.status(400).send('Dữ liệu không hợp lệ');
    }
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
