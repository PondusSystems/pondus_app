const stripeService = require('../services/stripeService');
const userService = require('../services/userService');
const subscriptionService = require('../services/subscriptionService');

const CreateCheckoutSession = async (req, res, next) => {
    try {
        const CLIENT_URL = req.get('origin');
        const { priceId } = req.body;
        const userId = req.user?.id;
        let stripeCustomerId = await userService.fetchUserStripeCustomerId(userId);
        if (!stripeCustomerId) {
            const user = await userService.fetchUser(userId);
            stripeCustomerId = await stripeService.createCustomer(user.name, user.email);
            await userService.updateUser(userId, { stripeCustomerId });
        }
        const sessionURL = await stripeService.createCheckoutSession(priceId, stripeCustomerId, CLIENT_URL);
        res.status(200).json({ url: sessionURL });
    } catch (error) {
        next(error);
    }
};

const StripeHooks = async (req, res, next) => {
    try {
        const sig = req.headers['stripe-signature'];
        const data = req.body;
        const event = await stripeService.constructEvent(sig, data);
        switch (event?.type) {
            case 'invoice.payment_succeeded':
                const data = await stripeService.handlePaymentSucceededEvent(event);
                await subscriptionService.addSubscription(data);
                res.status(200).json({ message: 'Subscription created!' });
                break;
            case 'customer.subscription.updated':
                const subscription = await stripeService.handleSubscriptionUpdatedEvent(event);
                await subscriptionService.updateSubscription(subscription);
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
        const customerId = await userService.fetchUserStripeCustomerId(userId);
        const sessionURL = await stripeService.createBillingPortalSession(customerId, CLIENT_URL);
        res.status(200).json({ url: sessionURL });
    } catch (error) {
        next(error);
    }
};

const UpdateSubscription = async (req, res, next) => {
    try {
        const { newPriceId } = req.body;
        const userId = req.user?.id;
        const { subscriptionId } = await subscriptionService.getUserSubscriptionInfo(userId);
        if (!subscriptionId) {
            return res.status(400).json({ error: 'No active subscription found!' });
        }
        const subscription = await stripeService.fetchSubscription(subscriptionId);
        const subscriptionItemId = subscription.items.data[0].id;
        await stripeService.updateSubscription(subscriptionId, subscriptionItemId, newPriceId);
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
