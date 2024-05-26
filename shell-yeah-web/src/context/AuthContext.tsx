import React, {createContext, useContext, useEffect, useState} from "react";
import axiosConfig from "../../axiosConfig.ts";
import {useOpenSnackbar} from "./SnackbarContext.tsx";

type user = {
    id: string,
    username: string
    avatar: string
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
        console.log("AuthContextProvider useEffect")

        axiosConfig.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem('accessToken'); // get stored access token

                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`; // set in header
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        if (localStorage.getItem('accessToken'))
            axiosConfig.post("/user/refresh")
                .then(res => {
                    setUser(res.data.user)
                    localStorage.setItem('accessToken', res.data.accessToken)
                    // openSnackbar(res.data.message)
                })
                .catch(e =>
                    openSnackbar("Token Refresh failed", "error", e.response.data.error)

                )
    }, [])

    return (
        <AuthUserContext.Provider value={user}>
            <AuthSetUserContext.Provider value={setUser}>
                {children}
            </AuthSetUserContext.Provider>
        </AuthUserContext.Provider>
    )
}