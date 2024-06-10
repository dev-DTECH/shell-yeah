import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useOpenSnackbar} from "../context/SnackbarContext.tsx";

function Arena() {
    const params = useParams()
    const openSnackbar = useOpenSnackbar()
    const [isStarted, setIsStarted] = useState(false)
    const arenaId = params["arenaId"]
    useEffect(() => {
        console.log("Arena ID: ", arenaId)
        document.title = `sHell Yeah! | Arena : ${arenaId}`
        openSnackbar(`Connected to arena "${arenaId}"`)
    }, [arenaId]);
    return (
        <h1>Arena: {params["arenaId"]}</h1>
    )
}

export default Arena