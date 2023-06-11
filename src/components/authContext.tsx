"use client"
import { getAccessToken } from "@/redux/services/commonService";
import { createContext, useState } from "react";

const AuthContext = createContext<{ isAuthenticated: () => boolean }>({ isAuthenticated: () => false });
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const isAuthenticated = () => {
        return getAccessToken()?.length ? true : false
    }
    return (
        <Provider
            value={{
                isAuthenticated
            }}
        >
            {children}
        </Provider>
    )
}
export { AuthContext, AuthProvider };

