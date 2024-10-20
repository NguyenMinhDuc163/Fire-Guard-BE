const { getAccessToken } = require('./src/configs/token.service');

getAccessToken().catch(console.error);