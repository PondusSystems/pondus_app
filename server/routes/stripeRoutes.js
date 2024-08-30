const router = require("express").Router();
const controller = require("../controllers/stripeController");
const authMiddleware = require("../middleware/authMiddleware");
const stripeSchemas = require('../schemas/stripeSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post(
    "/create-checkout-session",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['user']),
    validationMiddleware.validateRequest(stripeSchemas.createCheckoutSchema),
    controller.CreateCheckoutSession
);

router.post(
    "/webhooks",
    controller.StripeHooks
);

router.post(
    "/create-billing-portal-session",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['user']),
    controller.CreateBillingPortalSession
);

router.patch(
    "/update-subscription",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['user']),
    validationMiddleware.validateRequest(stripeSchemas.updateSubscriptionSchema),
    controller.UpdateSubscription
);

module.exports = router;
