import { ApiResponse, BaseRequest, PaginationData, SingleId } from '@/model/common'
import { VERSION1 } from '@/utils/constants'
import { generateRequest } from '@/utils/func'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithToken } from './fetchBaseQuery'
import { CourseCreateUpdate, CourseItem } from '@/model/course'

export const courseApi = createApi({
	reducerPath: 'courseApi',
	baseQuery: baseQueryWithToken,
	endpoints: (builder) => ({
		getCourses: builder.mutation<ApiResponse<PaginationData<CourseItem>>, any>({
			query: (query: any) => ({
				url: `${VERSION1}/Courses/Admin${generateRequest(query)}`,
				method: 'GET',
			})
		}),

		getCourseById: builder.mutation<ApiResponse<CourseItem>, string>({
			query: (id: string) => ({
				url: `${VERSION1}/Courses/Admin/${id}`,
				method: 'GET',
			})
		}),

		createCourse: builder.mutation<ApiResponse<SingleId>, CourseCreateUpdate>({
			query: (body) => ({
				url: `${VERSION1}/Courses/Admin`,
				body,
				method: 'POST',
			})
		}),

		updateCourseById: builder.mutation<ApiResponse<SingleId>, { id: string, data: CourseCreateUpdate }>({
			query: (body) => ({
				url: `${VERSION1}/Courses/Admin/${body.id}`,
				body: body.data,
				method: 'PUT',
			})
		}),

		deleteCourse: builder.mutation<ApiResponse<SingleId>, string>({
			query: (id: string) => ({
				url: `${VERSION1}/Courses/Admin/${id}`,
				method: 'DELETE',
			})
		})
	}),
})

export const { useGetCoursesMutation, useGetCourseByIdMutation, useCreateCourseMutation, useUpdateCourseByIdMutation, useDeleteCourseMutation, } = courseApi