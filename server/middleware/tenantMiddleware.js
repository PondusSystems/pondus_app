const tenantUtils = require('../utils/tenantUtils');
const connectDB = require('../configs/db.config');

const tenantMiddleware = async (req, res, next) => {
    try {
        console.log('Endpoint: ', req.originalUrl || req.url)
        const tenantId = req.headers['x-tenant-id'];
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant Id is required!', access: "blocked" });
        }

        const config = await tenantUtils.getTenantConfig(tenantId);
        const DB = config.dbURI;
        const connectionId = await connectDB(DB);
        console.log('Current connection Id: ', connectionId);
        req.dbConnectionId = connectionId;
        req.config = config;
        next();
    } catch (error) {
        if (error.code && error.message) {
            return res.status(error.code).json({ error: error.message, access: "blocked" });
        }
        else {
            return res.status(500).json({ error: 'Internal Server Error!', access: "blocked" });
        }
    }
};

module.exports = tenantMiddleware;
