const tenantUtils = require('../utils/tenantUtils');

const tenantMiddleware = async (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant Id is required!', access: "blocked" });
    }

    try {
        const config = await tenantUtils.getTenantConfig(tenantId);

        // Attach tenant configuration to the request object
        // req.tenantConfig = config;
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
