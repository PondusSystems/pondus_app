import axiosInstance from './axiosInstance';

const BASE_URL = '/api/stripe';

const stripeService = {
    createCheckoutSession: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/create-checkout-session`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createBillingPortalSession: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/create-billing-portal-session`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateSubscription: async (payload) => {
        try {
            const response = await axiosInstance.patch(`${BASE_URL}/update-subscription`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default stripeService;
