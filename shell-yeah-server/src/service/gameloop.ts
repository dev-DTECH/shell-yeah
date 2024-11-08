import {Server, Socket} from "socket.io";
import config from "config";
import {getEntitiesWithinRadius, updateEntity} from "./entity";
import {getAllArenaIds} from "./arena";
import Player from "../model/Player";
import {entities} from "../data/entities";

let startTime = performance.now();
let tps = 0
let startTimeTPS = performance.now();

function showTPS(deltaTime) {
    if (performance.now() - startTimeTPS > 1000) {
        console.log()
        console.log("----- TPS -----")
        console.table({"TPS": tps, "MSPT": deltaTime});

        // log("TPS  : " + tps)
        // log("MSPT : " + deltaTime)
        console.log("---------------")
        console.log()
        tps = 0;
        startTimeTPS = performance.now();
    } else {
        tps++;
    }
}

export default function gameloop(io: Server) {
    // loop logic
    const deltaTime = (performance.now() - startTime);
    if (deltaTime < (1000 / (config.get('tps')))) {
        setImmediate(() => gameloop(io))
        return
    }
    startTime = performance.now();

    if (config.get('debug.showTPS'))
        showTPS(deltaTime)

    // game logic
    try {
        // send updates to clients
        getAllArenaIds()
            .then((arenaIds) => {
                // for each arena
                return Promise.all(arenaIds.map((arenaId) => {
                    return (async () => {
                        // console.log(`Syncing arena ${arenaId}`)
                        const roomSocketIdsSet = io.sockets.adapter.rooms.get(`arena:${arenaId}`)
                        if (!roomSocketIdsSet) {
                            // console.log(`No players in arena ${arenaId}`)
                            return
                        }
                        const roomSocketIds = Array.from(roomSocketIdsSet)
                        for (const socketId of roomSocketIds) {
                            try {
                                // for each player in the arena
                                // console.log(`Syncing player ${socketId}`)
                                const clientPlayer = entities[socketId] as Player
                                // move player
                                clientPlayer.move(deltaTime)

                                await updateEntity(clientPlayer, arenaId)
                                const entitiesWithinRadius = await getEntitiesWithinRadius(arenaId, clientPlayer.x, clientPlayer.y, config.get('player.viewDistance'))
                                io.to(socketId).emit("sync", {entities: entitiesWithinRadius});

                                // DEBUG
                                // console.table(entitiesWithinRadius.map((entity) => {
                                //     return {
                                //         name: entity.name,
                                //         x: entity.x,
                                //         y: entity.y,
                                //         weaponRotation: (entity as Player).weapon.rotation,
                                //         // rotation: entity.rotation,
                                //         // rotationSpeed: entity.rotationSpeed,
                                //         // deltaTime
                                //     }
                                // }))
                            } catch (e) {
                                console.error(`Error syncing player ${socketId}`)
                                console.error(e)
                            }
                        }
                    })()
                }))
            })
    } catch (e) {
        console.error(e)
    }
    setImmediate(() => gameloop(io))
}