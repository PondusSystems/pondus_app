const factoryUtils = require('../utils/factoryUtils');
const commonService = require('./commonService');

const fetchProductInfo = async (stripeConfig, productId) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    try {
        const product = await stripe.products.retrieve(productId);
        if (!product) {
            const error = new Error('Product not found in Stripe!');
            error.code = 404;
            throw error;
        }
        // console.log('Product: ', product);

        if (!product.active) {
            const error = new Error('Product is not active!');
            error.code = 400;
            throw error;
        }

        const prices = await stripe.prices.list({
            product: productId,
            limit: 100,
        });

        if (!prices || prices.length <= 0) {
            const error = new Error('Product Prices not found in Stripe!');
            error.code = 404;
            throw error;
        }

        const productInfo = {
            productId: product.id,
            name: product.name,
            description: product.description,
            image: (product.images && product.images.length > 0) ? product.images[0] : null,
            priceId: prices.data[0].id,
            price: prices.data[0].unit_amount / 100,
            currency: prices.data[0].currency,
            type: prices.data[0].recurring ? 'Subscription' : 'Consultation',

            // recurring: prices.data[0].recurring,
            // prices: prices.data.map(price => ({
            //     id: price.id,
            //     unit_amount: price.unit_amount,
            //     currency: price.currency,
            //     recurring: price.recurring,
            //     nickname: price.nickname,
            // })),
        };
        // console.log('Product Info: ', productInfo);
        // console.log('Recurring: ', productInfo.prices[0].recurring);
        return productInfo;
    } catch (err) {
        if (err.code && !isNaN(err.code)) {
            throw err;
        }
        else {
            const error = new Error('Error while fetching product info from Stripe!');
            error.code = 400;
            throw error;
        }
    }
};

const createCustomer = async (stripeConfig, name, email) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    const customer = await stripe.customers.create({ name, email });
    if (!customer) {
        const error = new Error('Unable to create customer!');
        error.code = 400;
        throw error;
    }
    return customer.id;
};

const updateCustomerEmail = async (stripeConfig, stripeCustomerId, newEmail) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    const customer = await stripe.customers.update(stripeCustomerId, {
        email: newEmail,
    });
    if (!customer) {
        const error = new Error('Unable to update customer!');
        error.code = 400;
        throw error;
    }
};

const createCheckoutSession = async (stripeConfig, priceId, stripeCustomerId, CLIENT_URL) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    try {
        const session = await stripe.checkout.sessions.create(
            {
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `${CLIENT_URL}/success`,
                cancel_url: `${CLIENT_URL}/plans`,
                customer: stripeCustomerId,
            }
        );
        return session.url;
    } catch (error) {
        const newError = new Error('Unable to create checkout session!');
        newError.code = 400;
        throw newError;
    }
};

const constructEvent = async (stripeConfig, sig, data) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    try {
        const event = stripe.webhooks.constructEvent(data, sig, stripeConfig.webhookKey);
        return event;
    } catch (err) {
        const newError = new Error(`Unable to construct event!`);
        newError.code = 400;
        throw newError;
    }
};

const handlePaymentSucceededEvent = async (connectionId, stripeConfig, event) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    try {
        const invoice = event.data.object;
        // console.log('Invoice: ', invoice);
        const customerId = invoice.customer;

        const userId = await commonService.fetchUserId(connectionId, { stripeCustomerId: customerId });
        const chargeId = invoice.charge;
        const billingReason = invoice.billing_reason;
        // subscription_create
        const subscriptionId = invoice.subscription;
        const productId = invoice.lines.data[0].price.product;
        const { name, description } = await stripe.products.retrieve(productId);
        const planInfo = {
            productId,
            name,
            description,
            priceId: invoice.lines.data[0].price.id,
            amount: invoice.lines.data[0].price.unit_amount / 100,
            currency: invoice.currency,
        };
        const paidAmount = invoice.amount_paid / 100;
        const startDate = new Date(invoice.lines.data[0].period.start * 1000).toISOString();
        const endDate = new Date(invoice.lines.data[0].period.end * 1000).toISOString();
        const data = {
            user: userId,
            customerId,
            subscriptionInfo: {
                subscriptionId,
                chargeId,
                planInfo,
                paidAmount,
                billingReason,
                startDate,
                endDate
            }
        };
        return data;
    } catch (error) {
        console.log("Success Event Error: ", error);
        const newError = new Error(`Unable to fetch info from event!`);
        newError.code = 400;
        throw newError;
    }
};

const handleSubscriptionUpdatedEvent = async (connectionId, stripeConfig, event) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    try {
        const subscription = event.data.object;
        // console.log('Subscription: ', subscription);
        const customerId = subscription.customer;

        const userId = await commonService.fetchUserId(connectionId, { stripeCustomerId: customerId });
        const subscriptionId = subscription.id;
        const price = subscription.items.data[0].price;
        const productId = price.product;
        const { name, description } = await stripe.products.retrieve(productId);
        const planInfo = {
            productId,
            name,
            description,
            priceId: price.id,
            amount: price.unit_amount / 100,
            currency: price.currency,
        }
        const data = {
            user: userId,
            customerId,
            subscriptionInfo: {
                subscriptionId,
                planInfo,
            }
        };
        return data;
    } catch (error) {
        console.error('Event Error:', error);
        const newError = new Error(`Unable to fetch info from event!`);
        newError.code = 400;
        throw newError;
    }
};

const createBillingPortalSession = async (stripeConfig, customerId, CLIENT_URL) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    if (!customerId) {
        const newError = new Error(`Customer not found!`);
        newError.code = 404;
        throw newError;
    }
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${CLIENT_URL}/billing`,
        });

        return session.url;
    } catch (error) {
        if (err.code && !isNaN(err.code)) {
            throw error;
        }
        else {
            const newError = new Error(`Unable to create billing portal session!`);
            newError.code = 400;
            throw newError;
        }
    }
};

const fetchSubscription = async (stripeConfig, subscriptionId) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        return subscription;
    } catch (error) {
        const newError = new Error(`Unable to fetch subscription!`);
        newError.code = 404;
        throw newError;
    }
};

const updateSubscription = async (stripeConfig, subscriptionId, subscriptionItemId, newPriceId) => {
    const stripe = factoryUtils.createStripeClient(stripeConfig);
    try {
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            items: [
                {
                    id: subscriptionItemId,
                    price: newPriceId,
                },
            ],
            proration_behavior: 'create_prorations', // Automatically handle proration
        });

        return updatedSubscription;
    } catch (error) {
        const newError = new Error(`Unable to update subscription!`);
        newError.code = 400;
        throw newError;
    }
};

module.exports = {
    fetchProductInfo,
    createCustomer,
    updateCustomerEmail,
    constructEvent,
    handlePaymentSucceededEvent,
    handleSubscriptionUpdatedEvent,
    createCheckoutSession,
    createBillingPortalSession,
    fetchSubscription,
    updateSubscription
}