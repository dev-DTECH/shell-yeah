import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import config from 'config';
import Player from './src/model/Player.js';
import chalk from 'chalk';
let players = []
// const pubClient = createClient({ url: "redis://redis:6379" });
const pubClient = createClient({ url: "redis://127.0.0.1:6379", username: "default", password: "OHY6lbN9A9bir4h0B5bqsNdGltHkvuey" });

const subClient = pubClient.duplicate();
const redisClient = pubClient.duplicate();

let io
let tps = 0
let startTimeTPS = performance.now();
function showTPS(deltaTime) {
    if (performance.now() - startTimeTPS > 1000) {
        console.log()
        console.log("----- TPS -----")
        console.table({ "TPS": tps, "MSPT": deltaTime });

        // log("TPS  : " + tps)
        // log("MSPT : " + deltaTime)
        console.log("---------------")
        console.log()
        tps = 0;
        startTimeTPS = performance.now();
    }
    else {
        tps++;
    }
}

async function getPlayers(players) {
    return await Promise.all(players.map(async player => {
        return JSON.parse(await redisClient.get(`entity:${player.id}`, JSON.stringify(player)))
    }))
}

async function getAllEntities() {
    return await redisClient.keys("entity:*")
        .then(async keys => {
            return await Promise.all(keys.map(async key => {
                const entity = await redisClient.get(key)
                return JSON.parse(entity)
            }))
        })
        .catch(err => {
            console.error(err)
        })
}
let startTime = performance.now();
function gameLoop(io) {
    const deltaTime = (performance.now() - startTime);
    process.env.DELTA_TIME = deltaTime
    if (deltaTime < (1000 / (config.get('tps')))) {
        setImmediate(() => gameLoop(io))
        return
    }
    startTime = performance.now();

    if (config.get('debug.showTPS'))
        showTPS(deltaTime)
    Promise.all(players.map(async player => {
        let isChanged = false
        //  X += Speed * Math.Cos(angle);
        // Y += Speed * Math.Sin(angle);
        if (player?.key?.UP) {
            isChanged = true
            player.x += config.get('player.speed') * deltaTime * Math.sin(player.rotation)
            player.y += -config.get('player.speed') * deltaTime * Math.cos(player.rotation)
        }
        else if (player?.key?.DOWN) {
            isChanged = true
            player.x -= config.get('player.speed') * deltaTime * Math.sin(player.rotation)
            player.y -= -config.get('player.speed') * deltaTime * Math.cos(player.rotation)
        }
        if (player?.key?.LEFT) {
            isChanged = true
            player.rotation -= config.get('player.rotationSpeed') * deltaTime
        }
        else if (player?.key?.RIGHT) {
            isChanged = true
            player.rotation += config.get('player.rotationSpeed') * deltaTime
        }
        if (isChanged)
            await redisClient.set(`entity:${player.id}`, JSON.stringify(player))
        return player
    }))
        .then(updatedPlayers => {
            players = updatedPlayers
        })

    // console.log(entities.map(entity => entity.name))
    getAllEntities()
        .then(entities => {
            io.local.emit("sync", { entities });
        })
    // io.local.emit("sync", { entities: await getAllEntities() });
    // console.log(players)
    // io.local.emit("sync", { entities: players });
    // pubClient.publish("sync", JSON.stringify({ entities }));
    setImmediate(() => gameLoop(io))
}

async function main() {
    // const pubClient = createClient({ url: "redis://localhost:6379" });

    await Promise.all([
        pubClient.connect(),
        subClient.connect(),
        redisClient.connect()
    ]);

    io = new Server({
        adapter: createAdapter(pubClient, subClient)
    });
    gameLoop(io)

    // await subClient.subscribe("playerJoin", (data, channel) => {
    //     data = JSON.parse(data)
    //     console.log(`[${chalk.green("+")}] ${data.name}`)
    //     entities.push(new Player(data.id, data.name))
    //     console.log(entities.map(entity => entity.name))
    // });

    // await subClient.subscribe("move", (data, channel) => {
    //     data = JSON.parse(data)
    //     entities = entities.map(entity => {
    //         if (entity.id === data.id) {
    //             entity.key = data.key
    //         }
    //         return entity
    //     })
    // });

    // await subClient.subscribe("disconnect", (data, channel) => {
    //     data = JSON.parse(data)
    //     entities = entities.filter(entity => entity.id !== data.id)
    //     console.log(entities)
    //     console.log(`[${chalk.red("-")}] ${data.name}`)
    // });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on("playerJoin", async (data) => {
            await redisClient.set(`entity:${socket.id}`, JSON.stringify(new Player(socket.id, data.name)))
            console.log(`[${chalk.green("+")}] ${data.name}`)
            players.push(new Player(socket.id, data.name))
            // console.log("Player List:",await getAllEntities())
        });
        socket.on("disconnect", async () => {
            const player = JSON.parse(await redisClient.get(`entity:${socket.id}`))
            console.log(`[${chalk.red("-")}] ${player.name}`)
            await redisClient.del(`entity:${socket.id}`)
            // const entity = entities.find(e => e.id === socket.id)
            players = players.filter(e => e.id !== socket.id)
        });
        socket.on("message", (message) => {
            console.log(`Received message from ${socket.id}: ${message}`);
        });
        socket.on("joinArena", async (arenaId) => {
            socket.join(arenaId)
        })
        socket.on("move", async (data) => {
            // console.log(data)
            players = players.map(player => {
                if (player.id === socket.id) {
                    player.key = data.key
                }
                return player
            })
        });
        socket.on("ping", (callback) => {
            callback();
        });
    });

    io.listen(3000);
    console.log("[MAIN] Server running on port 3000");
}
console.log('[MAIN] Inside Main Thread!');
main();
// re-loads the current file inside a Worker instance.
