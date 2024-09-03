const router = require("express").Router();
const controller = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const subscriptionSchemas = require('../schemas/subscriptionSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.get(
    "/get-user-subscription-info",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['user']),
    controller.GetUserSubscriptionInfo
);
router.get(
    "/get-dashboard-data",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['admin']),
    validationMiddleware.validateQuery(subscriptionSchemas.dashboardDataSchema),
    controller.GetDashboardData
);

module.exports = router;
