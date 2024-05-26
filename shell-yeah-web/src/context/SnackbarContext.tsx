import React, {createContext, useContext, useState} from "react";
import {Alert, AlertTitle, Snackbar} from "@mui/material";

type Severity = 'error' | 'info' | 'success' | 'warning'

const SnackbarContext = createContext<null | ((title: string,
                                               severity?: Severity,
                                               description?: string) => void)>(null)

export function useOpenSnackbar() {
    const context = useContext(SnackbarContext)
    if (!context)
        throw new Error("useOpenSnackbar must be used within an SnackbarContextProvider")
    return context
}

export default function SnackbarContextProvider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [severity, setSeverity] = useState<Severity>("success")

    function openSnackbar(title: string,
                          severity: Severity = "success",
                          description = "") {
        setTitle(title)
        setDescription(description)
        setSeverity(severity)
        setOpen(true)
    }

    return (
        <SnackbarContext.Provider value={openSnackbar}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert
                    onClose={() => setOpen(false)}
                    severity={severity}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {description ? <AlertTitle>{title}</AlertTitle> : title}
                    {description ? description : null}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}
