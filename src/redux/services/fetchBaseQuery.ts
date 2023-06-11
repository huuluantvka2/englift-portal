import { BASE_URL } from "@/utils/constants"
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query"
import { getAccessToken } from "./commonService"

export const baseQueryWithToken = fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    prepareHeaders: headers => {
        const token = getAccessToken()
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    }
})

export const baseQueryWithoutToken = fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
})