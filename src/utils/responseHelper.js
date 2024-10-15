// Hàm chuẩn hóa phản hồi API với mã trạng thái và giá trị không null
const createResponse = (status, message, code, data = null, error = null) => {
    return {
        code,     // Mã phản hồi HTTP
        data: data !== null ? data : (Array.isArray(data) ? [] : {}),  // Nếu không có data, trả về mảng rỗng hoặc đối tượng rỗng
        status,   // Trạng thái phản hồi
        message: message || "",  // Nếu không có message, trả về chuỗi rỗng
        error: error || ""       // Nếu không có lỗi, trả về chuỗi rỗng
    };
};

module.exports = {
    createResponse
};
