import axiosInstance from './axiosInstance';

const BASE_URL = '/api/product';

const productService = {
    fetchAllProducts: async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/fetch-all-products`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addProduct: async (payload) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/add-product`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateProduct: async (productId, payload) => {
        try {
            const response = await axiosInstance.patch(`${BASE_URL}/update-product/${productId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteProduct: async (productId) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/delete-product/${productId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default productService;
