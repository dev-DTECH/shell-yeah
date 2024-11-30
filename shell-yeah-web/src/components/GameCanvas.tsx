import {useEffect, useState} from 'react';

import {Application, Assets, Container, SCALE_MODES, Sprite, Text, Texture} from 'pixi.js';
import {Socket} from "socket.io-client";
import Stats from './Stats';
import Controller from '../Controller';
import Box from "@mui/material/Box";
import constants from "../../constants.ts";

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

const textureBaseUrl = `${constants.ASSETS_URL}/map/tiles`
const tileSize = 160; // or whatever your tile size is
const tileImageMap: Record<number, string> = {
    0: "tile_0001.png",
    1: "tile_0020.png",
    2: "tile_0056.png",
    3: "tile_0054.png",
    4: "tile_0018.png",

    5: "tile_0093.png",
    6: "tile_0090.png",
    7: "tile_0091.png",
    8: "tile_0092.png",

    9: "tile_0038.png",
    10: "tile_0055.png",
    11: "tile_0036.png",
    12: "tile_0019.png",

    13: "tile_0130.png",
    14: "tile_0166.png",
    15: "tile_0110.png",
    16: "tile_0144.png",
    17: "tile_0129.png",
    18: "tile_0165.png",
    19: "tile_0163.png",
    20: "tile_0127.png",
    21: "tile_0130.png",
    22: "tile_0166.png",
    23: "tile_0130.png",
    24: "tile_0166.png",
    // add other textures as needed
}
// const tileTextures: Record<number, Texture> = {
//     0: await Assets.load(`${textureBaseUrl}/tile_0001.png`),
//     1: await Assets.load(`${textureBaseUrl}/tile_0020.png`),
//     2: await Assets.load(`${textureBaseUrl}/tile_0056.png`),
//     3: await Assets.load(`${textureBaseUrl}/tile_0054.png`),
//     4: await Assets.load(`${textureBaseUrl}/tile_0018.png`),
//
//     5: await Assets.load(`${textureBaseUrl}/tile_0093.png`),
//     6: await Assets.load(`${textureBaseUrl}/tile_0090.png`),
//     7: await Assets.load(`${textureBaseUrl}/tile_0091.png`),
//     8: await Assets.load(`${textureBaseUrl}/tile_0092.png`),
//
//     9: await Assets.load(`${textureBaseUrl}/tile_0038.png`),
//     10: await Assets.load(`${textureBaseUrl}/tile_0055.png`),
//     11: await Assets.load(`${textureBaseUrl}/tile_0036.png`),
//     12: await Assets.load(`${textureBaseUrl}/tile_0019.png`),
//
//     13: await Assets.load(`${textureBaseUrl}/tile_0130.png`),
//     14: await Assets.load(`${textureBaseUrl}/tile_0166.png`),
//     15: await Assets.load(`${textureBaseUrl}/tile_0110.png`),
//     16: await Assets.load(`${textureBaseUrl}/tile_0144.png`),
//     17: await Assets.load(`${textureBaseUrl}/tile_0129.png`),
//     18: await Assets.load(`${textureBaseUrl}/tile_0165.png`),
//     19: await Assets.load(`${textureBaseUrl}/tile_0163.png`),
//     20: await Assets.load(`${textureBaseUrl}/tile_0127.png`),
//     21: await Assets.load(`${textureBaseUrl}/tile_0130.png`),
//     22: await Assets.load(`${textureBaseUrl}/tile_0166.png`),
//     23: await Assets.load(`${textureBaseUrl}/tile_0130.png`),
//     24: await Assets.load(`${textureBaseUrl}/tile_0166.png`),
//     // add other textures as needed
// };

async function renderMap(position: { x: number, y: number }, tileMap: Record<string, number>) {
    const worldContainer = new Container({
        // this will make moving this container GPU powered
        isRenderGroup: true,
    });
    const tileTextures: Record<number, Texture> = {}
    // promise.all
    for (const key in tileImageMap) {
        tileTextures[Number(key)] = await Assets.load(`${textureBaseUrl}/${tileImageMap[key]}`)
    }

    for (const key in tileMap) {
        // console.log()
        const [x, y] = key.split(',').map(Number);
        const tileType = tileMap[key];
        tileTextures[tileType].baseTexture.scaleMode = SCALE_MODES.NEAREST;
        const sprite = new Sprite({
            texture: tileTextures[tileType],
            x: y * tileSize,
            y: x * tileSize,
            width: tileSize,
            height: tileSize,
            anchor: 0.5
        });
        // const coords = new Text({
        //     x: y * tileSize,
        //     y: x * tileSize,
        //     width: tileSize / 2,
        //     height: tileSize / 2,
        //     anchor: 0.5,
        //     text: key
        // })

        // const sprite = new Graphics({
        //         x: x * tileSize,
        //         y: y * tileSize,
        // })
        //
        // sprite.circle(0, 0, 2)
        // sprite.fill(0x0000ff)
        // worldContainer.width = 1000
        // worldContainer.height = 1000
        worldContainer.addChild(sprite);
    }
    worldContainer.x = position.x
    worldContainer.y = position.y
    return worldContainer;
}

export default function GameCanvas({socket, map}: { socket: Socket, map: Record<string, number> }) {
    const [tps, setTPS] = useState(0);
    const [ping, setPing] = useState(0);

    async function startGame() {
        const app = new Application();
        // await Assets.load(["http://localhost:3000/assets/tank/churchill/turret.png", "http://localhost:3000/assets/tank/churchill/hull.png"])
        const canvasContainer = document.querySelector("#game-canvas") as HTMLElement;
        if (!canvasContainer) return app;
        await app.init({
            background: '#1099bb',
            resizeTo: canvasContainer
        });
        canvasContainer?.appendChild(app.canvas);
        let me: Entity | undefined
        const mapContainer = await renderMap({
            x: 0,
            y: 0,
        }, map)
        app.stage.addChild(mapContainer);

        let entityContainer = new Container({
            height: app.canvas.height,
            width: app.canvas.width
        })

        let startTime = performance.now();
        let tps = 0
        socket.on("sync", (data: SyncPacket) => {
            // console.log(data)
            if (performance.now() - startTime > 1000) {
                // console.log("TPS: " + tps);
                setTPS(tps);
                // console.table(data.entities);
                tps = 0;
                startTime = performance.now();
            } else {
                tps++;
            }
            me = data.entities.find((entity) => entity.id === socket.id);
            if (!me) return;

            mapContainer.x = me.x + app.canvas.width / 2
            mapContainer.y = me.y + app.canvas.height / 2

            // app.stage.removeChildren();
            // console.log({map})
            entityContainer.destroy({children: true})
            entityContainer = new Container({
                height: app.canvas.height,
                width: app.canvas.width
            })
            app.stage.addChild(entityContainer);


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
                    if (!me) return;

                    updatedEntity = {
                        ...entity,
                        x: me.x - entity.x + app.canvas.width / 2,
                        y: me.y - entity.y + app.canvas.height / 2,
                    };
                }
                const texture = await Assets.load(`${constants.ASSETS_URL}/tank/${entity.texture}/hull.png`);
                const entitySprint = new Sprite(texture);
                entitySprint.anchor.set(0.5);
                entitySprint.x = updatedEntity.x;
                entitySprint.y = updatedEntity.y;
                entitySprint.rotation = updatedEntity.rotation;
                // console.log(me)
                entityContainer.addChild(entitySprint);

                // Render weapon
                if (entity.weapon) {
                    const weaponTexture = await Assets.load(`${constants.ASSETS_URL}/tank/${entity.weapon.texture}/turret.png`);
                    // const weaponSprite = new SpriteWrapper({
                    //     texturePath: `http://localhost:3000/assets/tank/${entity.weapon.texture}/turret.png`,
                    //     x: updatedEntity.x,
                    //     y: updatedEntity.y,
                    //     scale: 1,
                    //     rotation: entity.weapon.rotation,
                    //     anchor: {x: 0.5, y: 0.5},
                    //     interactive: false,
                    // })
                    const weaponSprite = new Sprite({
                        texture: weaponTexture,
                        x: updatedEntity.x,
                        y: updatedEntity.y,
                        scale: 1,
                        rotation: entity.weapon.rotation,
                        anchor: {x: 0.5, y: 0.5},
                    })

                    entityContainer.addChild(weaponSprite);
                    // const weaponTexture = await Assets.load(`http://localhost:3000/assets/tank/${entity.weapon.texture}/turret.png`);
                    // const weaponSprite = new Sprite(weaponTexture);
                    // weaponSprite.anchor.set(0.5);
                    // weaponSprite.x = updatedEntity.x;
                    // weaponSprite.y = updatedEntity.y;
                    // app.stage.addChild(weaponSprite);
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
                entityContainer.addChild(entityName);

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
                entityContainer.addChild(weapon);
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
        canvasContainer.addEventListener('mousemove', controller.handleMouseMove);
        app.resize()
        return app
    }

    useEffect(() => {

        let app: Application;
        startGame()
            .then((param) => {
                app = param
            })

        return () => {
            if (app)
                app.destroy(true, {children: true})
            socket.disconnect();
        }

    }, []);
    if (!socket) return


    return (
        <Box tabIndex={0} autoFocus id='game-canvas' sx={{height: "100%"}}>
            <Stats tps={tps} ping={ping} entityCount={0}/>
        </Box>
    );
}