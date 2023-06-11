export const setAccessToken = (access_token: string) => {
    localStorage.setItem('access_token', access_token)
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token')
}

export const clearAccessToken = () => {
    return localStorage.removeItem('access_token')
}