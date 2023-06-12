export interface UserLogin {
    email: string,
    password: string
}

export interface TokenResponse {
    accessToken: string,
    expiration: Date,
    userId: string
}

export interface UserItem {
    id: string,
    fullName: string,
    active: boolean,
    deteted: boolean,
    email: string,
    oAuthId?: string,
    phoneNumber?: string,
    refCode?: string,
    typeLogin: number,
    createdAt?: string | undefined,
    createdBy?: string | undefined,
    updatedAt?: string | undefined,
    updatedBy?: string | undefined
}