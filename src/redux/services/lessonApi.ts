import { ApiResponse, BaseRequest, PaginationData, SingleId } from '@/model/common'
import { VERSION1 } from '@/utils/constants'
import { generateRequest } from '@/utils/func'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithToken } from './fetchBaseQuery'
import { LessonCreate, LessonItem, LessonUpdate } from '@/model/lesson'

export const lessonApi = createApi({
	reducerPath: 'lessonApi',
	baseQuery: baseQueryWithToken,
	endpoints: (builder) => ({
		getLessons: builder.mutation<ApiResponse<PaginationData<LessonItem>>, { id: string, query: any }>({
			query: (request: any) => ({
				url: `${VERSION1}/Lessons/Admin/Course/${request.id}/${generateRequest(request.query)}`,
				method: 'GET',
			})
		}),

		getLessonById: builder.mutation<ApiResponse<LessonItem>, string>({
			query: (id: string) => ({
				url: `${VERSION1}/Lessons/Admin/${id}`,
				method: 'GET',
			})
		}),

		createLesson: builder.mutation<ApiResponse<SingleId>, LessonCreate>({
			query: (body) => ({
				url: `${VERSION1}/Lessons/Admin`,
				body,
				method: 'POST',
			})
		}),

		updateLessonById: builder.mutation<ApiResponse<SingleId>, { id: string, data: LessonUpdate }>({
			query: (body) => ({
				url: `${VERSION1}/Lessons/Admin/${body.id}`,
				body: body.data,
				method: 'PUT',
			})
		}),

		deleteLesson: builder.mutation<ApiResponse<SingleId>, string>({
			query: (id: string) => ({
				url: `${VERSION1}/Lessons/Admin/${id}`,
				method: 'DELETE',
			})
		})
	}),
})

export const { useGetLessonsMutation, useGetLessonByIdMutation, useCreateLessonMutation, useUpdateLessonByIdMutation, useDeleteLessonMutation, } = lessonApi