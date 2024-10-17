const app = require('./src/app.js');
const PORT = process.env.PORT || 3000;

// Lắng nghe trên tất cả địa chỉ IP với '0.0.0.0'
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
