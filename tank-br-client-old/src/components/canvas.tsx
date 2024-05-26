import { useMemo } from "react";
import { Stage, Container, Sprite, Text } from '@pixi/react';
import { Application, Assets, BlurFilter } from 'pixi.js';
import { io } from "socket.io-client";

// type Entity = {
//     id: string;
//     x: number;
//     y: number;
//     rotation: {
//         x: number;
//         y: number;
//     };
// }

// type SyncPacket = {
//     entities: Entity[]
// }

// let entities: Entity[] = [];

// function connectSocket() {
//     let startTime = performance.now();
//     let tps = 0
//     const socket = io("http://localhost:3000", {
//         // WARNING: in that case, there is no fallback to long-polling
//         transports: ["websocket", "polling"] // or [ "websocket", "polling" ] (the order matters)
//     });
//     socket.on("message", (data: string) => {
//         console.log(data);
//     });
//     socket.on("connect", () => {
//         socket.emit("playerJoin", { name: "Player" + Math.floor(Math.random() * 1000) });
//         console.log("Connected to server");
//     });
//     socket.on("sync", (data: SyncPacket) => {
//         if (performance.now() - startTime > 1000) {
//             console.log("TPS: " + tps);
//             console.log(data.entities);
//             tps = 0;
//             startTime = performance.now();
//         }
//         else {
//             tps++;
//         }
//         entities = data.entities;
//         // console.log(data);
//     });
//     setInterval(() => {
//         const start = performance.now();

//         socket.emit("ping", () => {
//             const ping = performance.now() - start;
//             console.log("Ping: ", ping, "ms");
//         });
//     }, 1000);
// }

// async function loadGame() {
//     console.log('Loading game...');
//     const app = new Application();

//     // Wait for the Renderer to be available
//     await app.init();

//     // The application will create a canvas element for you that you
//     // can then insert into the DOM
//     document.querySelector("#game-canvas")?.appendChild(app.canvas);

//     // load the texture we need
//     const texture = await Assets.load('https://pixijs.com/assets/panda.png');

//     // This creates a texture from a 'bunny.png' image
//     const bunny = new Sprite(texture);

//     // Setup the position of the bunny
//     bunny.x = app.renderer.width / 2;
//     bunny.y = app.renderer.height / 2;

//     // Rotate around the center
//     bunny.anchor.x = 0.5;
//     bunny.anchor.y = 0.5;

//     // Add the bunny to the scene we are building
//     app.stage.addChild(bunny);

//     // Listen for frame updates

//     app.ticker.add(() => {
//         entities.forEach(() => {
//             app.stage.addChild(bunny);
//         });
//         // each frame we spin the bunny around a bit
//         bunny.rotation += 1;
//         bunny.x += 1;
//     });
// }

export default function GameCanvas() {
    // connectSocket()
    // loadGame()
    const blurFilter = useMemo(() => new BlurFilter(4), []);

    return (
        <Stage options={{ background: 0xffffff }}>
            <Sprite
                image="https://pixijs.io/pixi-react/img/bunny.png"
                x={400}
                y={270}
                anchor={{ x: 0.5, y: 0.5 }}
            />

            <Container x={400} y={330}>
                <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} filters={[blurFilter]} />
            </Container>
        </Stage>
    );

    // return (
    //     <div>
    //         <Suspense fallback={<div>Loading...</div>}>
    //             <div id={"game-canvas"}></div>
    //         </Suspense>
    //     </div>
    // );
}