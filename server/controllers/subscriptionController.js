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

const GetDashboardData = async (req, res, next) => {
    try {
        const { year, view } = req.query;
        const parsedYear = parseInt(year);
        const turnover = await subscriptionService.getTurnoverData(parsedYear, view);
        const activeMembersCount = await subscriptionService.getActiveMembersCount();
        const newMembersCount = await subscriptionService.getNewMembersCount();
        const lostMembersCount = await subscriptionService.getLostMembersCount();
        const data = {
            turnover,
            activeMembersCount,
            newMembersCount,
            lostMembersCount
        };
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetUserSubscriptionInfo,
    GetDashboardData
};
