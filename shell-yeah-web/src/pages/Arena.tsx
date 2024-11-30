import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox.tsx";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Card, CardActions, CardContent, TextField } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight, PlayArrow, Share } from "@mui/icons-material";
import Box from "@mui/material/Box";
import TankImage from "../components/TankImage.tsx";
import IconButton from "@mui/material/IconButton";
import { useAccessToken, useUser } from "../context/AuthContext.tsx";
import Auth from "../components/Auth.tsx";
import GameCanvas from "../components/GameCanvas.tsx";
import { io, Socket } from "socket.io-client";
import constants from "../../constants.ts";

function Arena() {
    const params = useParams()
    const [hullIndex, setHullIndex] = useState(0)
    const [turretIndex, setTurretIndex] = useState(0)
    const navigate = useNavigate();
    const [arenaId, setArenaId] = useState(params["arenaId"] || "public")
    const [gameStatus, setGameStatus] = useState("stopped")
    const accessToken = useAccessToken()
    const user = useUser()
    const [map, setMap] = useState({})

    const [socket, setSocket] = useState<Socket | null>(null)


    useEffect(() => {
        console.log("Arena ID: ", arenaId)


        document.title = `sHell Yeah! | Arena : ${arenaId}`

    }, [arenaId]);

    useEffect(() => {

        if (!accessToken) return
        const socket = io({
            path: constants.SOCKET_BASE_URL,
            transports: ["websocket", "polling"], // or [ "websocket", "polling" ] (the order matters)
            auth: {
                token: accessToken
            }
        })
        console.log("socket connected")

        socket.emit("join_arena", { arenaId }, (data: { map: Record<string, number> }) => {
            console.log("join_arena", data)
            setMap(data.map)

        })
        setSocket(socket)

        return () => {
            if (socket)
                socket.close()
        }
    }, [accessToken]);
    // console.log("user", user)
    // console.log("accessToken",accessToken)

    if (!user) return <Auth open={true} />
    if (!socket) return <Typography>Loading...</Typography>

    if (!params["arenaId"])
        navigate("/arena/public")

    const hulls = ["churchill", "crusader"]
    const turrets = ["churchill", "crusader"]

    const hull = hulls[hullIndex]
    const turret = turrets[turretIndex]
    // console.log("Arena return ID: ", arenaId)

    console.log({ hullIndex, turretIndex })
    console.log({ hull, turret })
    return (
        <>
            <ChatBox arenaId={arenaId} socket={socket} />
            {gameStatus === "stopped" && <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}>
                <Typography variant="h3" sx={{ margin: 5 }}>Let the party begin!</Typography>
                <Box>
                    <IconButton onClick={() => {
                        setHullIndex((hullIndex - 1 + hulls.length) % hulls.length)
                    }}>
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant="h5" sx={{ margin: 5, display: "inline-block" }}>Hull - {hull}</Typography>
                    <IconButton onClick={() => {
                        setHullIndex((hullIndex + 1) % hulls.length)
                    }}>
                        <KeyboardArrowRight />
                    </IconButton>
                </Box>
                <Card sx={{ width: 345 }}>
                    <TankImage turret={turret} hull={hull} />


                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Tank 1
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button startIcon={<Share />} size="small">Share</Button>
                    </CardActions>
                </Card>
                <Box>
                    <IconButton size={"large"} onClick={
                        () => {
                            setTurretIndex((turretIndex - 1 + turrets.length) % turrets.length)
                        }
                    }>
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant="h5" sx={{ margin: 5, display: "inline-block" }} paragraph>Turret
                        - {turret}</Typography>
                    <IconButton size={"large"} onClick={
                        () => {
                            setTurretIndex((turretIndex + 1) % turrets.length)
                        }
                    }>
                        <KeyboardArrowRight />
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
                    <Button startIcon={<PlayArrow />} variant={"contained"} onClick={() => {
                        setGameStatus("started")
                    }}>Play</Button>
                </Box>
            </Box>}
            {gameStatus === "started" && <GameCanvas socket={socket} map={map} />}
        </>
    )
}

export default Arena