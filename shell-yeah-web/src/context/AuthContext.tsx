import React, {createContext, useContext, useEffect, useState} from "react";
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

const AuthUserContext = createContext<null | user>(null)
const AuthSetUserContext = createContext<React.Dispatch<React.SetStateAction<null | user>>>(null as unknown as React.Dispatch<React.SetStateAction<null | user>>)


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
    const [user, setUser] = useState<null | user>(null)
    const openSnackbar = useOpenSnackbar()
    useEffect(() => {

        let accessToken = localStorage.getItem('accessToken')

        if (!accessToken)
            return

        const tokenUser = jwtDecode<user>(accessToken)
        console.log(tokenUser)
        setUser(tokenUser)
        openSnackbar("Welcome back " + (tokenUser.fullName || tokenUser.username) + "👋")
        api.interceptors.request.use(
            async (config) => {
                if (tokenUser.exp * 1000 < Date.now()) {
                    const res = await unauthorizedApi.post('/user/refreshToken')
                    const {newAccessToken} = res.data
                    localStorage.setItem('accessToken', newAccessToken)
                    accessToken = newAccessToken
                }
                config.headers.Authorization = `Bearer ${accessToken}`; // set in header
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }, [])

    return (
        <AuthUserContext.Provider value={user}>
            <AuthSetUserContext.Provider value={setUser}>
                {children}
            </AuthSetUserContext.Provider>
        </AuthUserContext.Provider>
    )
}