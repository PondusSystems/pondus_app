import axiosInstance from './axiosInstance';

const BASE_URL = '/api/user';

const userService = {
    loginUser: async (payload, userType) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/${userType}-login`, payload, { withCredentials: true, skipAuthRefresh: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    registerUser: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/user-register`, payload, { withCredentials: true, skipAuthRefresh: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    forgotPassword: async (payload, userType) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/${userType}-forgot-password`, payload, { withCredentials: true, skipAuthRefresh: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    resetPassword: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/reset-password`, payload, { withCredentials: true, skipAuthRefresh: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    refreshToken: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/refresh-token`, payload, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logoutUser: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/logout`, payload, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUserInfo: async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/fetch-user-info`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateUserInfo: async (payload) => {
        try {
            const response = await axiosInstance.patch(`${BASE_URL}/update-user-info`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    changeUserPassword: async (payload) => {
        try {
            const response = await axiosInstance.patch(`${BASE_URL}/change-user-password`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    searchEmployees: async (query) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/search-employees`, { params: query });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    searchUsers: async (query) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/search-users`, { params: query });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createEmployee: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/create-employee`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createUser: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/create-user`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateEmployee: async (userId, payload) => {
        try {
            const response = await axiosInstance.patch(`${BASE_URL}/update-employee/${userId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (userId, payload) => {
        try {
            const response = await axiosInstance.patch(`${BASE_URL}/update-user/${userId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteEmployee: async (userId) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/delete-employee/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (userId) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/delete-user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;
