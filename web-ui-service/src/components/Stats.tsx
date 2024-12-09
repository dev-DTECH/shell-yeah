import {Paper} from "@mui/material";

export default function Stats({tps, ping, entityCount}: { tps: number, ping: number, entityCount: number }) {
    return (
        <Paper id="stats" elevation={5} sx={{position: "absolute", padding: "5px"}}>
            <h3>Stats</h3>
            <p>TPS: {tps}</p>
            <p>Ping: {ping.toFixed(2)}</p>
            <p>Entity Count: {entityCount}</p>
        </Paper>
    )
}