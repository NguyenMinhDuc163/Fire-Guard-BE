const { logger } = require('../utils/logger');

const logRequests = (req, res, next) => {
    const userId = req.user?.userId || 'anonymous';
    logger.info(`API called: ${req.method} ${req.url}`, {
        meta: {
            userId,
            ip: req.ip,
            body: req.body,
        },
    });
    next();
};

module.exports = { logRequests };
