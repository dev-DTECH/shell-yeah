import {useEffect, useState} from 'react';

import {Application, Assets, Sprite, Text} from 'pixi.js';
import {Socket} from "socket.io-client";
import Stats from './Stats';
import Controller from '../Controller';
import Box from "@mui/material/Box";

type Entity = {
    id: string;
    name: string;
    x: number;
    y: number;
    texture: string;
    rotation: number
    weapon: {
        damage: number,
        range: number,
        rotation: number,
        texture: string
    }
}

type SyncPacket = {
    entities: Entity[]
}

export default function GameCanvas({socket}: { socket: Socket }) {
    const [tps, setTPS] = useState(0);
    const [ping, setPing] = useState(0);

    async function startGame() {
        const app = new Application();
        await Assets.load(["http://localhost:3000/assets/tank/churchill/turret.png", "http://localhost:3000/assets/tank/churchill/hull.png"])
        const canvasContainer = document.querySelector("#game-canvas") as HTMLElement;
        if (!canvasContainer) return;
        await app.init({
            background: '#1099bb',
            resizeTo: canvasContainer
        });
        canvasContainer?.appendChild(app.canvas);

        let startTime = performance.now();
        let tps = 0
        socket.on("sync", (data: SyncPacket) => {
            if (performance.now() - startTime > 1000) {
                // console.log("TPS: " + tps);
                setTPS(tps);
                // console.table(data.entities);
                tps = 0;
                startTime = performance.now();
            } else {
                tps++;
            }
            const me = data.entities.find((entity) => entity.id === socket.id);
            // console.table(me)
            if (!me) return;
            app.stage.removeChildren();
            data.entities.forEach(async (entity) => {
                let updatedEntity: Entity
                if (entity.id === socket.id) {
                    updatedEntity = {
                        ...entity,
                        name: "You",
                        x: app.canvas.width / 2,
                        y: app.canvas.height / 2,
                    }

                } else {
                    updatedEntity = {
                        ...entity,
                        x: me.x - entity.x + app.canvas.width / 2,
                        y: me.y - entity.y + app.canvas.height / 2,
                    };
                }
                const texture = await Assets.load(`http://localhost:3000/assets/tank/${entity.texture}/hull.png`);
                const entitySprint = new Sprite(texture);
                entitySprint.anchor.set(0.5);
                entitySprint.x = updatedEntity.x;
                entitySprint.y = updatedEntity.y;
                entitySprint.rotation = updatedEntity.rotation;
                // console.log(me)
                app.stage.addChild(entitySprint);

                // Render weapon
                if (entity.weapon) {
                    const weaponTexture = await Assets.load(`http://localhost:3000/assets/tank/${entity.weapon.texture}/turret.png`);
                    const weaponSprite = new Sprite(weaponTexture);
                    weaponSprite.anchor.set(0.5);
                    weaponSprite.x = updatedEntity.x;
                    weaponSprite.y = updatedEntity.y;
                    app.stage.addChild(weaponSprite);
                }


                // Create text for the entity's name
                const entityName = new Text(updatedEntity.name, {
                    fontFamily: 'Arial',
                    fontSize: 15,
                    fill: 0xffffff, // white color
                    align: 'center'
                });
                entityName.anchor.set(0.5);
                entityName.x = updatedEntity.x;
                entityName.y = updatedEntity.y - 50; // Position above the sprite

                // Add the text to the stage
                app.stage.addChild(entityName);

                // Weapon
                const weapon = new Text("A", {
                    fontFamily: 'Arial',
                    fontSize: 15,
                    fill: 0xffffff, // white color
                    align: 'center'
                });

                weapon.anchor.set(0.5);
                weapon.x = 0;
                weapon.y = 0; // Position above the sprite
                app.stage.addChild(weapon);
                // app.stage.interactive = true;
                // canvasContainer.addEventListener('mousemove', (event) => {
                //     const {x, y} = event;
                //     console.log('mousemove', x, y, weapon.rotation)
                //     const weaponPosition = weapon.position;
                //     weapon.rotation = Math.atan2(y - weaponPosition.y, x - weaponPosition.x);
                // })

            })

        });
        setInterval(() => {
            const start = performance.now();
            socket.emit("ping", () => {
                const ping = performance.now() - start;
                // console.log("Ping: ", ping, "ms");
                setPing(ping);
            });
        }, 1000);
        const controller = new Controller(
            {
                "up": ["w", "ArrowUp"],
                "down": ["s", "ArrowDown"],
                "left": ["a", "ArrowLeft"],
                "right": ["d", "ArrowRight"]
            }
        )
        controller.onMove(() => {
            socket.emit("move", {key: controller.key});
        });
        window.addEventListener('keydown', controller.handleKeyDown);
        window.addEventListener('keyup', controller.handleKeyUp);
        app.resize()
        return app
    }


    useEffect(() => {
        startGame()
            .then(() => {
                console.log("Game started")
            })

        return () => {
            const canvasContainer = document.querySelector("#game-canvas") as HTMLElement;
            canvasContainer.remove()
        }
    }, []);

    return (
        <Box tabIndex={0} autoFocus id='game-canvas' sx={{height: "100%"}}>
            <Stats tps={tps} ping={ping} entityCount={0}/>
        </Box>
    );

    // return (
    //     <div>
    //         <Suspense fallback={<div>Loading...</div>}>
    //             <div id={"game-canvas"}></div>
    //         </Suspense>
    //     </div>
    // );
}