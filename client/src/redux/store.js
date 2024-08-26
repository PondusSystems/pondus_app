import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "./loaderSlice";
import logoutSlice from "./logoutSlice";
import userSlice from "./userSlice";
import companyInfoSlice from "./companyInfoSlice";

const store = configureStore({
    reducer: {
        loader: loaderSlice,
        logout: logoutSlice,
        user: userSlice,
        companyInfo: companyInfoSlice
    },
});

export default store;