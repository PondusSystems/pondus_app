const Subscription = require('../models/subscriptionModel');
const moment = require("moment");

const addSubscription = async (data) => {
    try {
        const { user, customerId, subscriptionInfo } = data;
        const existingUserSubscription = await Subscription.findOne({ user });
        let newSubscription;
        if (!existingUserSubscription) {
            newSubscription = await Subscription.create({
                user,
                customerId,
                subscriptions: [subscriptionInfo]
            });
        }
        else {
            existingUserSubscription.customerId = customerId;
            existingUserSubscription.subscriptions.push(subscriptionInfo);
            await existingUserSubscription.save();
        }
        return existingUserSubscription;
    } catch (error) {
        const newError = new Error(`Unable to add subscription!`);
        newError.code = 400;
        throw newError;
    }
};

const getUserSubscriptionStatus = async (userId) => {
    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
        return {
            status: '',
            paymentStatus: 'Failed'
        };
    }
    const now = new Date();
    let isActive = false;
    let isNew = false;
    let paymentStatus = 'Failed';

    isActive = subscription.subscriptions.some(sub => {
        return sub.endDate >= now && sub.status === 'active';
    });

    // Check for new memberships
    isNew = subscription.subscriptions.some(sub => {
        return sub.endDate >= now && sub.status === 'active' && sub.startDate >= moment().subtract(30, 'days').toDate() &&
            sub.billingReason === 'subscription_create';
    });

    // Determine status and paymentStatus
    let status = 'Lost';
    if (isNew) {
        status = 'New';
        paymentStatus = 'Success';
    } else if (isActive) {
        status = 'Active';
        paymentStatus = 'Success';
    }

    return {
        status: status,
        paymentStatus: paymentStatus
    };
};

const getUserSubscriptionInfo = async (userId) => {
    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
        return {
            status: false,
            planName: '',
            productId: '',
            amount: null
        };
    }
    const now = new Date();
    let status = false;
    let planName = '';
    let productId = '';

    const activeSubscription = subscription.subscriptions.find(sub => {
        return sub.endDate >= now && sub.status === 'active';
    });

    if (activeSubscription) {
        status = true;
        planName = activeSubscription.planInfo.name;
        productId = activeSubscription.planInfo.productId;
        amount = activeSubscription.planInfo.amount
    }

    return {
        status,
        planName,
        productId,
        amount
    };
};

// getUserSubscriptionInfo('66bfe860c2020fb2f65bedfa');

const getActiveMembers = async () => {
    const now = new Date();

    const activeMembers = await Subscription.aggregate([
        { $unwind: "$subscriptions" },  // Flatten the subscriptions array
        {
            $match: {
                "subscriptions.endDate": { $gte: now },  // End date is in the future
                "subscriptions.status": "active"  // Ensure status is active
            }
        },
        {
            $group: {
                _id: "$user",  // Group by user
                count: { $sum: 1 }  // Count the number of active subscriptions
            }
        }
    ]);

    console.log("Active Members: ", activeMembers);
    return activeMembers;
}

// getActiveMembers();

const getNewMembers = async () => {
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const now = new Date();

    const newMembers = await Subscription.aggregate([
        { $unwind: "$subscriptions" },  // Flatten the subscriptions array
        {
            $match: {
                "subscriptions.endDate": { $gte: now },  // End date is in the future
                "subscriptions.status": "active",  // Ensure status is active
                "subscriptions.startDate": { $gte: thirtyDaysAgo },  // Start date is within the last 30 days
                "subscriptions.billingReason": "subscription_create"  // Billing reason is 'subscription_create'
            }
        },
        {
            $group: {
                _id: "$user",  // Group by user
                count: { $sum: 1 }  // Count the number of new subscriptions
            }
        }
    ]);

    console.log("New Members: ", newMembers);
    return newMembers;
}

// getNewMembers();

const getLostMembers = async () => {
    const now = new Date();

    const activeUsers = await getActiveMembers();

    const activeUserIds = activeUsers.map(user => user._id);
    console.log('Active Ids: ', activeUserIds);

    // Then, find users who were previously subscribed but are now lost
    const lostMembers = await Subscription.aggregate([
        { $unwind: "$subscriptions" },  // Flatten the subscriptions array
        {
            $match: {
                "subscriptions.endDate": { $lt: now },  // End date is in the past
                "user": { $nin: activeUserIds }  // User is not in the list of active users
            }
        },
        {
            $group: {
                _id: "$user",  // Group by user
                count: { $sum: 1 }  // Count the number of lost subscriptions
            }
        }
    ]);

    console.log("Lost Members: ", lostMembers);
    return lostMembers;
}

// getLostMembers();


module.exports = {
    addSubscription,
    getUserSubscriptionStatus,
    getUserSubscriptionInfo
}