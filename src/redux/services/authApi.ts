import { ApiResponse } from '@/model/common'
import { TokenResponse, UserLogin } from '@/model/user'
import { BASE_URL, VERSION1 } from '@/utils/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithoutToken } from './fetchBaseQuery'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: baseQueryWithoutToken,
	endpoints: (builder) => ({
		loginAdmin: builder.mutation<ApiResponse<TokenResponse>, UserLogin>({
			query: (body: UserLogin) => ({
				url: `${VERSION1}/Auths/Admin/Signin`,
				method: 'POST',
				body,
			})
		})
	}),
})

export const { useLoginAdminMutation
} = authApi