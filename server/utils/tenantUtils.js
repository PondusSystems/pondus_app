const axios = require('axios');
const cryptoUtils = require('./cryptoUtils');

const ADMIN_SERVER_BASE_URL = process.env.ADMIN_SERVER_BASE_URL;

const getTenantConfig = async (tenantId) => {
    try {
        const response = await axios.get(`${ADMIN_SERVER_BASE_URL}/api/tenant/get-tenant-config/${tenantId}`);
        // console.log(response.data.config);
        if (response.data?.config) {
            const decryptedConfig = cryptoUtils.decryptData(response.data?.config);
            console.log('Decrypted Data: ', JSON.parse(decryptedConfig));
            return JSON.parse(decryptedConfig);
        }
    } catch (error) {
        console.log('Error: ' + error);
        const newError = new Error(error.response.data?.error || 'Error while retrieving tenant configuration!');
        newError.code = error.response.status || 500;
        throw newError;
    }
};

// getTenantConfig('example123');

module.exports = { getTenantConfig };
