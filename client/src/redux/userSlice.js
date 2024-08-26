import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ShowLoading, HideLoading } from './loaderSlice';
import userService from '../services/userService';

const initialState = {
    user: null,
    userError: null
};

// Define an async thunk for fetching user info
export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, { dispatch }) => {
        dispatch(ShowLoading());
        try {
            const response = await userService.getUserInfo();
            return response.user;
        } catch (error) {
            throw error;
        } finally {
            dispatch(HideLoading());
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser(state) {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.user = action.payload;
                state.userError = null;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.userError = action.error.message;
            });
    }
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
