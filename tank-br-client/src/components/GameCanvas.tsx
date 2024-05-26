import { useEffect, useState } from 'react';

import { Application, Assets, Sprite, TextStyle } from 'pixi.js';
import { io, Socket } from "socket.io-client";
import EntityComp from './Entity';
import Stats from './Stats';
import Controller from '../Controller';
import Player from './Player';

const HEIGHT = 800
const WIDTH = 800

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


async function connectSocket(setTPS, setPing) {
  const app = new Application();
  await Assets.load(["assets/Churchill/ww2_top_view_turret7.png", "assets/Churchill/ww2_top_view_hull7.png"])
  await app.init({ background: '#1099bb', resizeTo: window });
  document.querySelector("#game-canvas")?.appendChild(app.canvas);
  
  let startTime = performance.now();
  let tps = 0
  const socket = io("http://localhost:3000", {
    // WARNING: in that case, there is no fallback to long-polling
    transports: ["websocket", "polling"] // or [ "websocket", "polling" ] (the order matters)
  });
  socket.on("message", (data: string) => {
    console.log(data);
  });
  socket.on("connect", () => {
    socket.emit("playerJoin", { name: "Player" + Math.floor(Math.random() * 1000) });
    console.log("Connected to server");
  });
  socket.on("sync", (data: SyncPacket) => {
    if (performance.now() - startTime > 1000) {
      // console.log("TPS: " + tps);
      setTPS(tps);
      // console.log(data.entities);
      tps = 0;
      startTime = performance.now();
    }
    else {
      tps++;
    }
    const me = data.entities.find((entity) => entity.id === socket.id);
    app.stage.removeChildren();
    data.entities.forEach((entity) => {
      let updatedEntity = entity
      if (entity.id === socket.id) {
        updatedEntity =  {
          ...entity,
          name: "You",  
          x: WIDTH / 2,
          y: HEIGHT / 2,
        }
      }
      else {
        updatedEntity =  {
          ...entity,
          x: entity.x - me.x + app.canvas.width / 2,
          y: entity.y - me.y + app.canvas.height / 2,
        };
      }
      const sprite = Sprite.from("assets/"+updatedEntity.texture);
      sprite.anchor.set(0.5);
      sprite.x = updatedEntity.x;
      sprite.y = updatedEntity.y;
      sprite.rotation = updatedEntity.rotation;
      // console.log(me)
      app.stage.addChild(sprite);
    })
      
    // entities = updatedEntities;

  });
  setInterval(() => {
    const start = performance.now();

    socket.emit("ping", () => {
      const ping = performance.now() - start;
      // console.log("Ping: ", ping, "ms");
      setPing(ping);
    });
  }, 1000);
  const controller: Controller = new Controller(
    {
      "UP": ["w", "ArrowUp"],
      "DOWN": ["s", "ArrowDown"],
      "LEFT": ["a", "ArrowLeft"],
      "RIGHT": ["d", "ArrowRight"]
    }
  )
  controller.onMove(() => {
    socket.emit("move", { key: controller.key });
  });
  window.addEventListener('keydown', controller.handleKeyDown);
  window.addEventListener('keyup', controller.handleKeyUp);
  return socket
}


export default function GameCanvas() {
  const [tps, setTPS] = useState(0);
  const [ping, setPing] = useState(0);



  useEffect(() => {
    // const controller: Controller = new Controller(
    //   {
    //     "UP": ["w", "ArrowUp"],
    //     "DOWN": ["s", "ArrowDown"],
    //     "LEFT": ["a", "ArrowLeft"],
    //     "RIGHT": ["d", "ArrowRight"]
    //   }
    // )
    connectSocket(setTPS, setPing);
    // controller.onMove(() => {
    //   socket.emit("move", { key: controller.key });
    // });
    // window.addEventListener('keydown', controller.handleKeyDown);
    // window.addEventListener('keyup', controller.handleKeyUp);
    // loadGame()
  }, []);
  return (
    <div tabIndex={0} autoFocus id='game-canvas'>
      {/* <Stage width={WIDTH} height={HEIGHT} options={{ background: 0x1099bb }}>
        {entities.map((entity) => (
          // <Sprite key={entity.id} image={bunnyUrl} x={entity.x} y={entity.y} />
          <Player entity={entity} />
        ))}
      </Stage> */}
      <Stats tps={tps} ping={ping} entityCount={0} />
    </div>
  );

  // return (
  //     <div>
  //         <Suspense fallback={<div>Loading...</div>}>
  //             <div id={"game-canvas"}></div>
  //         </Suspense>
  //     </div>
  // );
}