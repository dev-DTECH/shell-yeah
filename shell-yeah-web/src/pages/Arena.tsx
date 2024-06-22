import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useOpenSnackbar} from "../context/SnackbarContext.tsx";
import ChatBox from "../components/ChatBox.tsx";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Card, CardActions, CardContent, CardMedia} from "@mui/material";
import {Share} from "@mui/icons-material";
import Box from "@mui/material/Box";
import TankAssets from "../components/TankAssets.ts";

function Arena() {
    const params = useParams()
    const openSnackbar = useOpenSnackbar()
    // const [isStarted, setIsStarted] = useState(false)
    const [hull, setHull] = useState("churchill")
    const [turret, setTurret] = useState("churchill")
    const [turretRotation, setTurretRotation] = useState(0)

    const arenaId = params["arenaId"] || "public"
    useEffect(() => {
        console.log("Arena ID: ", arenaId)
        document.title = `sHell Yeah! | Arena : ${arenaId}`
        openSnackbar(`Connected to arena "${arenaId}"`)
    }, [arenaId]);

    useEffect(() => {
        document.addEventListener("mousemove", (e) => {
            const turretEle = document.querySelector("img[title='tank turret']")

            const x = e.clientX
            const y = e.clientY
            const centerX = turretEle.getBoundingClientRect().x + 70
            const centerY = turretEle.getBoundingClientRect().y + 70
            const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 90

            setTurretRotation(angle)
        })
    }, []);

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
                <Card sx={{width: 345}}>
                    {/*<CardMedia*/}
                    {/*    sx={{height: 140}}*/}
                    {/*    image="/"*/}
                    {/*    title="green iguana"*/}
                    {/*/>*/}
                    <Box sx={{display: "flex", placeContent: "center"}}>
                        <Box sx={{position: "relative"}}>
                            <img
                                style={{height: 140, position: "relative"}}
                                src={TankAssets[hull].hull}
                                title="tank hull"
                            />
                            <img
                                style={{height: 140, position: "absolute", top: 0, left: 0, rotate: `${turretRotation}deg`}}
                                src={TankAssets[hull].turret}
                                title="tank turret"
                            />
                        </Box>
                    </Box>


                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Tank 1
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button startIcon={<Share/>} size="small">Share</Button>
                    </CardActions>
                </Card>
            </Box>
            {/*<h1>Arena: {params["arenaId"]}</h1>*/}
        </>
    )
}

export default Arena