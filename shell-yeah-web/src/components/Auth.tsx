import {ModalClose, ModalDialog} from "@mui/joy";
import {Button, Link, DialogTitle, Stack, Modal, TextField, Typography} from "@mui/material";
import {useRef, useState} from "react";
import {useSetUser} from "../context/AuthContext.tsx";
import api, {unauthorizedApi} from "../../axiosConfig.ts";
import {useOpenSnackbar} from "../context/SnackbarContext.tsx";
import {isAxiosError} from "axios";
// import {jwtDecode} from "jwt-decode";
//
// type user = {
//     exp: number;
//     id: string,
//     username: string
//     avatar: string
//     fullName?: string
// }

type AuthProps = {
    open: boolean,
    setOpen?: ((open: boolean) => void)
}

function Auth({open, setOpen}: AuthProps) {
    if(setOpen === undefined) {
        setOpen = () => {}
    }

    const setUser = useSetUser()
    const [isLogin, setIsLogin] = useState(true)

    const usernameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const confirmPasswordRef = useRef<HTMLInputElement>(null)

    const openSnackbar = useOpenSnackbar()

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
                <ModalClose onClick={() => setOpen(false)}/>
                <DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
                <form
                    onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        if (isLogin) {
                            // Login
                            try {
                                const res = await unauthorizedApi.post("/user/login", {
                                    username: usernameRef.current?.value,
                                    password: passwordRef.current?.value
                                })
                                const {user, accessToken} = res.data
                                setUser({
                                    ...user,
                                    accessToken
                                })
                                openSnackbar(res.data.message)
                            } catch (e) {
                                if (isAxiosError(e))
                                    openSnackbar("Login failed", "error", e.response?.data.error)
                                return
                            }
                        } else {
                            // Register
                            try {

                                const res = await api.post("/user/register", {
                                    email: emailRef.current?.value,
                                    username: usernameRef.current?.value,
                                    password: passwordRef.current?.value
                                })
                                setUser(res.data.user)
                                setIsLogin(true)
                                openSnackbar(res.data.message)
                            } catch (e) {
                                if (isAxiosError(e))
                                    openSnackbar("Register failed", "error", e.response?.data.error)
                                return
                            }
                        }
                        setOpen(false);
                    }
                    }
                >
                    <Stack spacing={2}>
                        <TextField label={isLogin ? "Username / Email" : "Username"} variant="outlined" required
                                   inputRef={usernameRef}/>
                        {isLogin ? null : <TextField label="Email" variant="outlined" required type={"email"}
                                                     inputRef={emailRef}/>
                        }
                        <TextField label="Password" variant="outlined" required type="password" inputRef={passwordRef}/>
                        {isLogin ? null :
                            <TextField label="Contirm Password" variant="outlined" required type={"password"}
                                       inputRef={confirmPasswordRef}/>}
                        <Button type="submit" variant="contained"
                                color="primary">{isLogin ? "Login" : "Register"}</Button>

                        <Typography>{isLogin ? "Don't have an account?" : "Already have an account?"}
                            {" "}
                            <Link sx={{fontWeight: "bold"}}
                                  onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Register" : "Login"}</Link>
                        </Typography>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    )
}

export default Auth