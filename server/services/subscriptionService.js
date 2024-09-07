const Subscription = require('../models/subscriptionModel');
const moment = require("moment");

const addSubscription = async (data) => {
    try {
        const { user, customerId, subscriptionInfo } = data;
        const existingUserSubscription = await Subscription.findOne({ user });
        if (!existingUserSubscription) {
            const newSubscription = await Subscription.create({
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
    } catch (error) {
        const newError = new Error(`Unable to add subscription!`);
        newError.code = 400;
        throw newError;
    }
};

const updateSubscription = async (data) => {
    try {
        const { user, customerId, subscriptionInfo } = data;
        const now = new Date();
        const existingUserSubscription = await Subscription.findOne({ user });
        if (!existingUserSubscription) {
            const newError = new Error(`No subscription found!`);
            newError.code = 400;
            throw newError;
        }
        const activeSubscription = existingUserSubscription.subscriptions.find(sub => {
            return sub.subscriptionId === subscriptionInfo.subscriptionId && sub.endDate >= now && sub.status === 'active';
        });
        if (!activeSubscription) {
            const newError = new Error(`No active subscription with this subscription id found!`);
            newError.code = 400;
            throw newError;
        }
        activeSubscription.planInfo = subscriptionInfo.planInfo;
        existingUserSubscription.customerId = customerId;
        await existingUserSubscription.save();
    } catch (error) {
        if (error.code) {
            throw error;
        }
        else {
            const newError = new Error(`Unable to add subscription!`);
            newError.code = 400;
            throw newError;
        }
    }
};

const getUserSubscriptionStatus = async (userId) => {
    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
        return {
            status: [],
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
    let status = [];
    if (isActive, isNew) {
        status = ['New', 'Active'];
        paymentStatus = 'Success';
    } else if (isNew) {
        status = ['New'];
        paymentStatus = 'Success';
    } else if (isActive) {
        status = ['Active'];
        paymentStatus = 'Success';
    } else {
        status = ['Lost'];
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
            subscriptionId: '',
            planName: '',
            productId: '',
            amount: null
        };
    }
    const now = new Date();
    let status = false;
    let subscriptionId = '';
    let planName = '';
    let productId = '';


    const activeSubscription = subscription.subscriptions.find(sub => {
        return sub.endDate >= now && sub.status === 'active';
    });

    if (activeSubscription) {
        status = true;
        subscriptionId = activeSubscription.subscriptionId;
        planName = activeSubscription.planInfo.name;
        productId = activeSubscription.planInfo.productId;
        amount = activeSubscription.planInfo.amount;
    }

    return {
        status,
        subscriptionId,
        planName,
        productId,
        amount
    };
};

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
            }
        }
    ]);

    // console.log("Active Members: ", activeMembers);
    return activeMembers;
};

const getActiveMembersCount = async () => {
    const activeUsers = await getActiveMembers();
    // console.log("Active Members: ", activeUsers);
    return activeUsers.length;
};

const getNewMembersCount = async () => {
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
            }
        }
    ]);

    // console.log("New Members: ", newMembers.length);
    return newMembers.length;
};

const getLostMembersCount = async () => {
    const now = new Date();

    const activeUsers = await getActiveMembers();

    const activeUserIds = activeUsers.map(user => user._id);

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
            }
        }
    ]);

    // console.log("Lost Members: ", lostMembers.length);
    return lostMembers.length;
};

const getTurnoverData = async (year, period) => {
    const startDate = new Date(year, 0, 1); // Start of the year
    const endDate = new Date(year + 1, 0, 1); // Start of next year

    const periodMappings = {
        monthly: {
            groupBy: { $month: "$subscriptions.startDate" },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        quarterly: {
            groupBy: {
                $switch: {
                    branches: [
                        { case: { $lte: [{ $month: "$subscriptions.startDate" }, 3] }, then: 'Q1' },
                        { case: { $lte: [{ $month: "$subscriptions.startDate" }, 6] }, then: 'Q2' },
                        { case: { $lte: [{ $month: "$subscriptions.startDate" }, 9] }, then: 'Q3' },
                        { case: { $lte: [{ $month: "$subscriptions.startDate" }, 12] }, then: 'Q4' }
                    ],
                    default: "Unknown"
                }
            },
            labels: ['Q1', 'Q2', 'Q3', 'Q4']
        },
        halfYearly: {
            groupBy: {
                $cond: [
                    { $lte: [{ $month: "$subscriptions.startDate" }, 6] }, 'H1', 'H2'
                ]
            },
            labels: ['H1', 'H2']
        },
        yearly: {
            groupBy: { $year: "$subscriptions.startDate" },
            labels: Array.from({ length: 5 }, (_, i) => year - 4 + i)  // Last 5 years including the current year
        }
    };

    // Get the period mapping
    const { groupBy, labels } = periodMappings[period] || {};
    // console.log(groupBy, labels);

    if (!groupBy) {
        const newError = new Error(`Invalid period!`);
        newError.code = 400;
        throw newError;
    }

    const turnoverData = await Subscription.aggregate([
        { $unwind: "$subscriptions" },
        { $match: { "subscriptions.startDate": { $gte: startDate }, "subscriptions.endDate": { $lt: endDate }, "subscriptions.status": "active" } },
        {
            $project: {
                period: groupBy,
                amount: "$subscriptions.paidAmount"
            }
        },
        {
            $group: {
                _id: "$period",
                totalTurnover: { $sum: "$amount" }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ]);

    const result = labels.map((label, labelIndex) => {
        const found = turnoverData.find(item => period === 'monthly' ? item._id === labelIndex + 1 : item._id === label);
        return { period: label, totalTurnover: found ? found.totalTurnover : 0 };
    });

    // console.log(`${period.charAt(0).toUpperCase() + period.slice(1)} Turnover: `, result);
    return result;
};

// getTurnoverData(2024, 'monthly');

const getGrowthRateData = async (year, period) => {
    // const turnoverData = await getTurnoverData(year, period);
    const turnoverData = [
        { period: 'Jan', totalTurnover: 0 },
        { period: 'Feb', totalTurnover: 150 },
        { period: 'Mar', totalTurnover: 0 },
        { period: 'Apr', totalTurnover: 170 },
        { period: 'May', totalTurnover: 250 },
        { period: 'Jun', totalTurnover: 200 },
        { period: 'Jul', totalTurnover: 250 },
        { period: 'Aug', totalTurnover: 300 },
        { period: 'Sep', totalTurnover: 400 },
        { period: 'Oct', totalTurnover: 550 },
        { period: 'Nov', totalTurnover: 490 },
        { period: 'Dec', totalTurnover: 600 }
    ];

    let growthRate = [];
    let initialTurnover = 150;
    // const searchedItem = turnoverData.find(item => item.totalTurnover > 0);
    // if (searchedItem) {
    //     initialTurnover = searchedItem.totalTurnover;
    // }
    for (let i = 1; i < turnoverData.length; i++) {
        const currentTurnOver = turnoverData[i].totalTurnover;
        const previousTurnOver = turnoverData[i - 1].totalTurnover;
        let rate;
        let relativeRate;
        rate = ((currentTurnOver - previousTurnOver) / previousTurnOver) * 100;
        relativeRate = ((currentTurnOver - initialTurnover) / initialTurnover) * 100;
        // if (currentTurnOver === 0 && previousTurnOver === 0) {
        //     rate = 0;
        // } else {
        //     rate = ((currentTurnOver - previousTurnOver) / previousTurnOver) * 100;
        // }
        // if (currentTurnOver === 0) {
        //     relativeRate = 0;
        // }
        // else {
        //     relativeRate = ((currentTurnOver - initialTurnover) / initialTurnover) * 100;
        // }
        growthRate[i - 1] = {
            period: turnoverData[i].period,
            growthRate: parseFloat(rate.toFixed(0)),
            relativeGrowthRate: parseFloat(relativeRate.toFixed(0))
        }
    };
    console.log('Growth Rate: ', growthRate);
};

// getGrowthRateData();

module.exports = {
    addSubscription,
    updateSubscription,
    getUserSubscriptionStatus,
    getUserSubscriptionInfo,
    getTurnoverData,
    getActiveMembersCount,
    getNewMembersCount,
    getLostMembersCount
}