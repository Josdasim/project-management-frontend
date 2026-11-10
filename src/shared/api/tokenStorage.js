const ACCESS_KEY = 'pm_access_token'
const REFRESH_KEY = 'pm_refresh_token'

export const tokenStorage = {
    getAccess: () => localStorage.getItem(ACCESS_KEY),
    getRefresh: () => localStorage.getItem(REFRESH_KEY),
    set: ({ access_token, refresh_token }) => {
        localStorage.setItem(ACCESS_KEY, access_token)
        localStorage.setItem(REFRESH_KEY, refresh_token)
    },
    clear: () =>{
        localStorage.removeItem(ACCESS_KEY)
        localStorage.removeItem(REFRESH_KEY)
    }
}