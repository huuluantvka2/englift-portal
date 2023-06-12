import { ApiResponse, BaseRequest, PaginationData, SingleId } from '@/model/common'
import { UserItem } from '@/model/user'
import { VERSION1 } from '@/utils/constants'
import { generateRequest } from '@/utils/func'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithToken } from './fetchBaseQuery'

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: baseQueryWithToken,
	endpoints: (builder) => ({
		getUsers: builder.mutation<ApiResponse<PaginationData<UserItem>>, any>({
			query: (query: any) => ({
				url: `${VERSION1}/Users/Admin${generateRequest(query)}`,
				method: 'GET',
			})
		}),

		getUserById: builder.mutation<ApiResponse<UserItem>, string>({
			query: (id: string) => ({
				url: `${VERSION1}/Users/Admin/${id}`,
				method: 'GET',
			})
		}),

		updateUserById: builder.mutation<ApiResponse<SingleId>, { id: string, data: any }>({
			query: (body) => ({
				url: `${VERSION1}/Users/Admin/${body.id}`,
				body: body.data,
				method: 'PUT',
			})
		}),

		deleteUser: builder.mutation<ApiResponse<SingleId>, string>({
			query: (id: string) => ({
				url: `${VERSION1}/Users/Admin/${id}`,
				method: 'DELETE',
			})
		})
	}),
})

export const { useGetUsersMutation, useGetUserByIdMutation, useUpdateUserByIdMutation, useDeleteUserMutation, } = userApi