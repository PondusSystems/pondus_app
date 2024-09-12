const stripeService = require('../services/stripeService');
const userService = require('../services/userService');
const subscriptionService = require('../services/subscriptionService');

const CreateCheckoutSession = async (req, res, next) => {
    try {
        const CLIENT_URL = req.get('origin');
        const { priceId } = req.body;
        const userId = req.user?.id;
        let stripeCustomerId = await userService.fetchUserStripeCustomerId(req.dbConnectionId, userId);
        if (!stripeCustomerId) {
            const user = await userService.fetchUser(req.dbConnectionId, userId);
            stripeCustomerId = await stripeService.createCustomer(req.config.stripe, user.name, user.email);
            await userService.updateUser(req.dbConnectionId, req.config.stripe, userId, { stripeCustomerId });
        }
        const sessionURL = await stripeService.createCheckoutSession(req.config.stripe, priceId, stripeCustomerId, CLIENT_URL);
        res.status(200).json({ url: sessionURL });
    } catch (error) {
        next(error);
    }
};

const StripeHooks = async (req, res, next) => {
    try {
        const sig = req.headers['stripe-signature'];
        const data = req.body;
        const event = await stripeService.constructEvent(req.config.stripe, sig, data);
        switch (event?.type) {
            case 'invoice.payment_succeeded':
                const data = await stripeService.handlePaymentSucceededEvent(req.dbConnectionId, req.config.stripe, event);
                await subscriptionService.addSubscription(req.dbConnectionId, data);
                res.status(200).json({ message: 'Subscription created!' });
                break;
            case 'customer.subscription.updated':
                const subscription = await stripeService.handleSubscriptionUpdatedEvent(req.dbConnectionId, req.config.stripe, event);
                await subscriptionService.updateSubscription(req.dbConnectionId, subscription);
                res.status(200).json({ message: 'Subscription updated!' });
                break;
            // case 'checkout.session.expired':
            //     await stripeService.handleCheckoutExpiredEvent(event);
            //     break;
            default:
                res.status(200).json({ message: 'Unhandled webhooks event!' });
        }
    } catch (error) {
        next(error);
    }
};

const CreateBillingPortalSession = async (req, res, next) => {
    try {
        const CLIENT_URL = req.get('origin');
        const userId = req.user?.id;
        const customerId = await userService.fetchUserStripeCustomerId(req.dbConnectionId, userId);
        const sessionURL = await stripeService.createBillingPortalSession(req.config.stripe, customerId, CLIENT_URL);
        res.status(200).json({ url: sessionURL });
    } catch (error) {
        next(error);
    }
};

const UpdateSubscription = async (req, res, next) => {
    try {
        const { newPriceId } = req.body;
        const userId = req.user?.id;
        const { subscriptionId } = await subscriptionService.getUserSubscriptionInfo(req.dbConnectionId, userId);
        if (!subscriptionId) {
            return res.status(400).json({ error: 'No active subscription found!' });
        }
        const subscription = await stripeService.fetchSubscription(req.config.stripe, subscriptionId);
        const subscriptionItemId = subscription.items.data[0].id;
        await stripeService.updateSubscription(req.config.stripe, subscriptionId, subscriptionItemId, newPriceId);
        res.status(200).json({ message: 'Subscription updated successfully!' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    CreateCheckoutSession,
    StripeHooks,
    CreateBillingPortalSession,
    UpdateSubscription
};
