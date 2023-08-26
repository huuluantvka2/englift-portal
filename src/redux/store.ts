import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { showMessage } from "@/utils/message";
import { clearAccessToken } from "./services/commonService";
import { courseApi } from "./services/courseApi";
import { lessonApi } from "./services/lessonApi";
import { wordApi } from "./services/wordApi";
import { showSwalMessage } from "@/utils/func";

const errorHandlingMiddleware = (store) => (next) => (action) => {
    if (action?.payload?.status >= 400) {
        if (action?.payload?.status === 401) {
            showMessage('error', 'Đăng nhập hết hạn, vui lòng đăng nhập lại')
            clearAccessToken()
            window.location.href = '/login'
        } else {
            showSwalMessage('Xảy ra lỗi', action?.payload?.data?.message, 'error')
        }
        return
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer,
        [wordApi.reducerPath]: wordApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat(
            [
                authApi.middleware,
                userApi.middleware,
                courseApi.middleware,
                lessonApi.middleware,
                wordApi.middleware,

                errorHandlingMiddleware
            ]
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;