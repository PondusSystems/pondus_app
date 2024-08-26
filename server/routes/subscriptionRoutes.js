const router = require("express").Router();
const controller = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const stripeSchemas = require('../schemas/stripeSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.get(
    "/get-user-subscription-info",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['user']),
    // validationMiddleware.validateRequest(stripeSchemas.createCheckoutSchema),
    controller.GetUserSubscriptionInfo
);

module.exports = router;
