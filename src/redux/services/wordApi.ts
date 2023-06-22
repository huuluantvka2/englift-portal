import { ApiResponse, BaseRequest, PaginationData, SingleId } from '@/model/common'
import { VERSION1 } from '@/utils/constants'
import { generateRequest } from '@/utils/func'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithToken } from './fetchBaseQuery'
import { WordCreate, WordItem, WordUpdate } from '@/model/word'

export const wordApi = createApi({
	reducerPath: 'wordApi',
	baseQuery: baseQueryWithToken,
	endpoints: (builder) => ({
		getWords: builder.mutation<ApiResponse<PaginationData<WordItem>>, any>({
			query: (request: any) => ({
				url: `${VERSION1}/Words/Admin/Lesson${generateRequest(request)}`,
				method: 'GET',
			})
		}),

		getWordById: builder.mutation<ApiResponse<WordItem>, string>({
			query: (id: string) => ({
				url: `${VERSION1}/Words/Admin/${id}`,
				method: 'GET',
			})
		}),

		createWord: builder.mutation<ApiResponse<SingleId>, WordCreate>({
			query: (body) => ({
				url: `${VERSION1}/Words/Admin`,
				body,
				method: 'POST',
			})
		}),

		updateWordById: builder.mutation<ApiResponse<SingleId>, { id: string, data: WordUpdate }>({
			query: (body) => ({
				url: `${VERSION1}/Words/Admin/${body.id}`,
				body: body.data,
				method: 'PUT',
			})
		}),

		deleteWord: builder.mutation<ApiResponse<SingleId>, { id: string, lessonId: string }>({
			query: (query) => ({
				url: `${VERSION1}/Words/Admin/${query.id}?lessonId=${query.lessonId}`,
				method: 'DELETE',
			})
		})
	}),
})

export const { useGetWordsMutation, useGetWordByIdMutation, useCreateWordMutation, useUpdateWordByIdMutation, useDeleteWordMutation, } = wordApi