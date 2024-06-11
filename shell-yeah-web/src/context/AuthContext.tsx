import React, {createContext, useContext, useLayoutEffect, useState} from "react";
import {useOpenSnackbar} from "./SnackbarContext.tsx";
import {jwtDecode} from "jwt-decode";
import api, {unauthorizedApi} from "../../axiosConfig.ts";

type user = {
    exp: number;
    id: string,
    username: string
    avatar: string
    fullName?: string
}

const AuthUserContext = createContext<user | undefined>(undefined)
const AuthSetUserContext = createContext<React.Dispatch<React.SetStateAction<undefined | user>>>(undefined as unknown as React.Dispatch<React.SetStateAction<undefined | user>>)


export function useUser() {
    const context = useContext(AuthUserContext)
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
        const res = await unauthorizedApi.post('/user/refreshToken')
        const {newAccessToken} = res.data
        setAccessToken(newAccessToken)
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
            <AuthSetUserContext.Provider value={setUser}>
                {children}
            </AuthSetUserContext.Provider>
        </AuthUserContext.Provider>
    )
}