import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ShowLoading, HideLoading } from './loaderSlice';
import companyInfoService from '../services/companyInfoService';

const initialState = {
    companyInfo: null,
    companyInfoError: null
};

export const fetchCompanyInfo = createAsyncThunk(
    'company/fetchCompanyInfo',
    async (_, { dispatch }) => {
        if (window.location.pathname === '/blocked') {
            return;
        }
        dispatch(ShowLoading());
        try {
            const response = await companyInfoService.getCompanyInfo();
            return response?.companyInfo; // Ensure this matches the expected shape
        } catch (error) {
            throw error;
        } finally {
            dispatch(HideLoading());
        }
    }
);

const companyInfoSlice = createSlice({
    name: 'companyInfo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
                state.companyInfo = action.payload; // Payload should have the company info structure
                state.companyInfoError = null;
            })
            .addCase(fetchCompanyInfo.rejected, (state, action) => {
                state.companyInfoError = action.error.message;
            });
    }
});

export default companyInfoSlice.reducer;
