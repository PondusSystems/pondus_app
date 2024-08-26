const subscriptionService = require('../services/subscriptionService');

const GetUserSubscriptionInfo = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const info = await subscriptionService.getUserSubscriptionInfo(userId);
        res.status(200).json({ info });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetUserSubscriptionInfo,
};
