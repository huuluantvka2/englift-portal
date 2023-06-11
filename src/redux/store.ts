import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { showMessage } from "@/utils/message";
import { clearAccessToken } from "./services/commonService";

const errorHandlingMiddleware = (store) => (next) => (action) => {
    if (action?.payload?.status === 401) {
        showMessage('error', 'Đăng nhập hết hạn, vui lòng đăng nhập lại')
        clearAccessToken()
        window.location.href = '/login'
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    devTools: process.env.NODE_ENV !== "production",

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat(
            [
                authApi.middleware,
                userApi.middleware,

                errorHandlingMiddleware
            ]
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;