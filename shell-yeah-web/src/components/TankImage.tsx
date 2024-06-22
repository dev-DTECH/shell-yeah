import crusaderHull from '../assets/tanks/crusader/hull.png'
import crusaderTurret from '../assets/tanks/crusader/turret.png'

import churchillHull from '../assets/tanks/churchill/hull.png'
import churchillTurret from '../assets/tanks/churchill/turret.png'
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";

const TankAssets = {
    crusader: {
        hull: crusaderHull,
        turret: crusaderTurret,
    },
    churchill: {
        hull: churchillHull,
        turret: churchillTurret,
    },
}

export default function TankImage({turret, hull}) {
    const [turretRotation, setTurretRotation] = useState(0)

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
    )
}