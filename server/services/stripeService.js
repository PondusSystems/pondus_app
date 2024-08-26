const stripe = require('../configs/stripe.config');
const commonService = require('./commonService');

const fetchProductInfo = async (productId) => {
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
        const error = new Error('Error while fetching product info from Stripe!');
        error.code = 400;
        throw error;
    }
};

const createCustomer = async (name, email) => {
    const customer = await stripe.customers.create({ name, email });
    if (!customer) {
        const error = new Error('Unable to create customer!');
        error.code = 400;
        throw error;
    }
    return customer.id;
};

const updateCustomerEmail = async (stripeCustomerId, newEmail) => {
    const customer = await stripe.customers.update(stripeCustomerId, {
        email: newEmail,
    });
    if (!customer) {
        const error = new Error('Unable to update customer!');
        error.code = 400;
        throw error;
    }
};

const createCheckoutSession = async (priceId, stripeCustomerId, CLIENT_URL) => {
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
        console.log('Checkout Error: ', error);
        const newError = new Error('Unable to create checkout session!');
        newError.code = 400;
        throw newError;
    }
};

const constructEvent = async (sig, data) => {
    try {
        const event = stripe.webhooks.constructEvent(data, sig, process.env.STRIPE_WEBHOOKS_KEY);
        return event;
    } catch (err) {
        console.error('Webhook Error:', err.message);
        const newError = new Error(`Unable to construct event!`);
        newError.code = 400;
        throw newError;
    }
};

const handlePaymentSucceededEvent = async (event) => {
    try {
        const invoice = event.data.object;
        // console.log('Invoice: ', invoice);
        const customerId = invoice.customer;

        const userId = await commonService.fetchUserId({ stripeCustomerId: customerId });
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
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
        }
        const startDate = new Date(invoice.lines.data[0].period.start * 1000).toISOString();
        const endDate = new Date(invoice.lines.data[0].period.end * 1000).toISOString();
        const data = {
            user: userId,
            customerId,
            subscriptionInfo: {
                subscriptionId,
                chargeId,
                planInfo,
                billingReason,
                startDate,
                endDate
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

const createBillingPortalSession = async (customerId, CLIENT_URL) => {
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
        console.log('Billing Error: ', error);
        const newError = new Error(`Unable to create billing portal session!`);
        newError.code = 400;
        throw newError;
    }
};

const test = async (priceId) => {
    const price = await stripe.prices.retrieve(priceId);
    console.log(price);
};

const priceId = 'price_1Phsi2L3hPHcFVDk8ICs0GMh';
// test(priceId);

module.exports = {
    fetchProductInfo,
    createCustomer,
    updateCustomerEmail,
    constructEvent,
    handlePaymentSucceededEvent,
    createCheckoutSession,
    createBillingPortalSession
}