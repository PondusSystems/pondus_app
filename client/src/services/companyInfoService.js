import axiosInstance from './axiosInstance';

const BASE_URL = '/api/company-info';

const companyInfoService = {
    getCompanyInfo: async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/fetch-company-info`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateCompanyInfo: async (payload) => {
        try {
            const response = await axiosInstance.patch(`${BASE_URL}/update-company-info`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default companyInfoService;