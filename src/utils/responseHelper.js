const createResponse = (status, message, code, data = null, error = null) => {
    return {
        code,
        data: data !== null ? data : (Array.isArray(data) ? [] : {}),
        status,
        message: message || "",
        error: error || ""
    };
};

module.exports = {
    createResponse
};
