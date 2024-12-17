import React, {createContext, useContext, useLayoutEffect, useState} from "react";
import {useOpenSnackbar} from "./SnackbarContext.tsx";
import {jwtDecode} from "jwt-decode";
import api, {userService} from "../../axiosConfig.ts";

type user = {
    exp: number;
    id: string,
    username: string
    avatar: string
    fullName?: string
}

type SetUserParams = (user & { accessToken?: string }) | undefined

const AuthUserContext = createContext<user | undefined>(undefined)
const AuthAccessTokenContext = createContext<string | undefined>(undefined)
const AuthSetUserContext = createContext<((user: SetUserParams) => void) | undefined>(undefined)


export function useUser() {
    const context = useContext(AuthUserContext)
    // if (!context)
    //     throw new Error("useUser must be used within an AuthContextProvider")

    return context
}

export function useAccessToken() {
    const context = useContext(AuthAccessTokenContext)
    // if (!context)
    //     throw new Error("useUser must be used within an AuthContextProvider")

    return context
}

export function useSetUser() {
    const context = useContext(AuthSetUserContext)
    if (!context)
        throw new Error("useSetUser must be used within an AuthContextProvider")

    return context
}

export default function AuthContextProvider({children}: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string>()

    const [user, setUser] = useState<user>()


    async function refreshToken() {
        const res = await userService.post('/user/refresh-token')
        const {newAccessToken} = res.data
        setAccessToken(newAccessToken)

        console.log("setAccessToken")
        return newAccessToken
    }

    const openSnackbar = useOpenSnackbar()
    useLayoutEffect(() => {
        api.interceptors.request.use(
            async (config) => {
                if (accessToken) {
                    const tokenUser = jwtDecode<user>(accessToken)
                    if (tokenUser.exp * 1000 < (new Date).getTime()) {
                        console.log("Token expired, refreshing")
                        const refreshedAccessToken = await refreshToken()
                        config.headers.Authorization = `Bearer ${refreshedAccessToken}`; // set in header
                        return config
                    }
                    config.headers.Authorization = `Bearer ${accessToken}`; // set in header
                    return config
                }
                console.log("No token, refreshing")
                const refreshedAccessToken = await refreshToken()
                config.headers.Authorization = `Bearer ${refreshedAccessToken}`; // set in header
                return config
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }, [accessToken])

    useLayoutEffect(() => {
        if (user) {
            openSnackbar(`Welcome back, ${user?.username}!`)
            return
        }
        api.get('/user/me').then(res => {
            setUser(res.data.user)
        })
    }, [user]);


    return (
        <AuthUserContext.Provider value={user}>
            <AuthSetUserContext.Provider value={(user) => {
                setAccessToken(user?.accessToken)
                delete user?.accessToken
                setUser(user)
            }}>
                <AuthAccessTokenContext.Provider value={accessToken}>
                    {children}
                </AuthAccessTokenContext.Provider>
            </AuthSetUserContext.Provider>
        </AuthUserContext.Provider>
    )
}