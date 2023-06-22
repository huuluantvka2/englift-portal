export interface ApiResponse<T> {
    success: boolean
    message?: string
    statusCode: number
    data?: T
}

export interface PaginationData<T> {
    items: T[],
    totalRecord: number
}

export interface BaseRequest {
    limit?: number,
    page?: number,
    search?: string,
    sort?: number
}

export interface SingleId {
    id: string
}

export interface IAudit {
    createdAt?: string | undefined,
    createdBy?: string | undefined,
    updatedAt?: string | undefined,
    updatedBy?: string | undefined
}