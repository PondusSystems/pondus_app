import axiosInstance from './axiosInstance';

const BASE_URL = '/api/subscription';

const subscriptionService = {
    getUserSubscriptionInfo: async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/get-user-subscription-info`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getDashboardData: async (query) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/get-dashboard-data`, { params: query });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default subscriptionService;
