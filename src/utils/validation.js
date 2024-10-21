const Joi = require('joi');

exports.validateSensorData = (data) => {
    const schema = Joi.object({
        device_id: Joi.string().required(),
        flame_sensor: Joi.boolean().required(),
        mq2_gas_level: Joi.number().integer().required(),
        mq135_air_quality: Joi.number().integer().required(),
        timestamp: Joi.date().iso().required(),
    });
    return schema.validate(data);
};
exports.validateNotificationData = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        title: Joi.string().required(),
        body: Joi.string().required(),
    });

    return schema.validate(data);
};


exports.validateEmergencyData = (data) => {
    const schema = Joi.object({
        location: Joi.string().required(),
        incident_details: Joi.string().required(),
        timestamp: Joi.date().iso().required(),
        phone_number: Joi.string().optional(), // Không bắt buộc
    });
    return schema.validate(data);
};


exports.validateFamilyNotificationData = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        family_member_id: Joi.string().required(),
        message: Joi.string().required(),
        timestamp: Joi.date().iso().required(),
        phone_number: Joi.string().optional(), // Không bắt buộc
    });
    return schema.validate(data);
};

exports.validateHistoryRequest = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional(),
    });
    return schema.validate(data);
};

exports.validateMultipleIotStatusData = (data) => {
    const schema = Joi.array().items(
        Joi.object({
            device_name: Joi.string().required(),
            status: Joi.string().valid('active', 'inactive', 'error').required(),
            timestamp: Joi.date().iso().required(),
        })
    );
    return schema.validate(data);
};

exports.validateGuidesAndNewsQuery = (data) => {
    const schema = Joi.object({
        category: Joi.string().valid('guide', 'news').required(),
        limit: Joi.number().integer().min(1).optional()
    });
    return schema.validate(data);
};


exports.validateMultipleGuidesAndNewsData = (data) => {
    const schema = Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            type: Joi.string().valid('video', 'article').required(),
            url: Joi.string().uri().allow(null).optional(),
            content: Joi.string().allow(null).optional(),
            category: Joi.string().valid('guide', 'news').required(),
        })
    );
    return schema.validate(data);
};

exports.validateRegisterData = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        token_fcm: Joi.string().optional()
    });
    return schema.validate(data);
};

exports.validateLoginData = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};
