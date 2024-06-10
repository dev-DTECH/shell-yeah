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
    const accessToken = localStorage.getItem('accessToken')
    const tokenUser = accessToken ? jwtDecode<user>(accessToken) : null

    const [user, setUser] = useState<null | user>(tokenUser)

    const openSnackbar = useOpenSnackbar()
    useEffect(() => {
        if (user)
            openSnackbar("Welcome back " + (user.fullName || user.username) + "👋")

        api.interceptors.request.use(
            async (config) => {
                if(!user) return config
                console.log("User: ", user)
                if ((user.exp * 1000 < (new Date).getTime())) {
                    console.log("Token expired")
                    const res = await unauthorizedApi.post('/user/refreshToken')
                    const {newAccessToken} = res.data
                    // setAccessToken(newAccessToken)
                    localStorage.setItem('accessToken', newAccessToken)
                }
                config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`; // set in header
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }, [user])


    return (
        <AuthUserContext.Provider value={user}>
            <AuthSetUserContext.Provider value={setUser}>
                {children}
            </AuthSetUserContext.Provider>
        </AuthUserContext.Provider>
    )
}