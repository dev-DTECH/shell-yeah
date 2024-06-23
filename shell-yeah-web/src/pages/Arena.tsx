import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useOpenSnackbar} from "../context/SnackbarContext.tsx";
import ChatBox from "../components/ChatBox.tsx";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Card, CardActions, CardContent, TextField} from "@mui/material";
import {KeyboardArrowLeft, KeyboardArrowRight, PlayArrow, Share} from "@mui/icons-material";
import Box from "@mui/material/Box";
import TankImage from "../components/TankImage.tsx";
import IconButton from "@mui/material/IconButton";
import {useUser} from "../context/AuthContext.tsx";
import Auth from "../components/Auth.tsx";

function Arena() {
    const user = useUser()
    if(!user) return <Auth open={true} />

    const params = useParams()
    const openSnackbar = useOpenSnackbar()
    // const [isStarted, setIsStarted] = useState(false)
    const [hull, setHull] = useState("churchill")
    const [turret, setTurret] = useState("churchill")
    const navigate = useNavigate();
    const [arenaId, setArenaId] = useState(params["arenaId"] || "public")
    // let arenaId = params["arenaId"]
    if (!params["arenaId"])
        navigate("/arena/public")


    useEffect(() => {
        console.log("Arena ID: ", arenaId)
        // if (!arenaId) {
        //     console.log(`${new Date().getTime()}`)
        //     setArenaId("public")
        //     navigate("/arena/public")
        // }


        document.title = `sHell Yeah! | Arena : ${arenaId}`
    }, [arenaId]);

    console.log("Arena return ID: ", arenaId)

    return (
        <>
            <ChatBox arenaId={arenaId}/>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}>
                <Typography variant="h3" sx={{margin: 5}}>Let the party begin!</Typography>
                <Box>
                    <IconButton>
                        <KeyboardArrowLeft/>
                    </IconButton>
                    <Typography variant="h5" sx={{margin: 5, display: "inline-block"}}>Hull - {hull}</Typography>
                    <IconButton>
                        <KeyboardArrowRight/>
                    </IconButton>
                </Box>
                <Card sx={{width: 345}}>
                    <TankImage turret={turret} hull={hull}/>


                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Tank 1
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button startIcon={<Share/>} size="small">Share</Button>
                    </CardActions>
                </Card>
                <Box>
                    <IconButton size={"large"}>
                        <KeyboardArrowLeft/>
                    </IconButton>
                    <Typography variant="h5" sx={{margin: 5, display: "inline-block"}} paragraph>Turret
                        - {turret}</Typography>
                    <IconButton size={"large"}>
                        <KeyboardArrowRight/>
                    </IconButton>
                </Box>
                <Box sx={{
                    display: "flex",
                    gap: 2,
                    margin: 5
                }}>

                    <TextField label={`Arena`} defaultValue={`${arenaId}`} onChange={(e) => {
                        e.preventDefault()
                        navigate(`/arena/${e.currentTarget.value}`)
                        setArenaId(e.currentTarget.value)
                    }}></TextField>
                    <Button startIcon={<PlayArrow/>} variant={"contained"}>Play</Button>
                </Box>
            </Box>
        </>
    )
}

export default Arena