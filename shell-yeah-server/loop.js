const { createClient } = require("redis");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const config = require('config');
let io

const pubClient = createClient({ url: "redis://localhost:6379" });
// const pubClient = createClient({ url: "redis://broker:6379" });
const subClient = pubClient.duplicate();


async function main() {
    await Promise.all([
        pubClient.connect(),
        subClient.connect()
    ]);

    io = new Server({
        adapter: createAdapter(pubClient, subClient)
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
        socket.on("message", (message) => {
            console.log(`Received message from ${socket.id}: ${message}`);
            socket.broadcast.emit("message", message);
        });
        socket.on("move", (message) => {
            console.log(`Received message from ${socket.id}: ${message}`);
            socket.broadcast.emit("message", message);
        });
        socket.on("ping", (callback) => {
            callback();
        });
    });

    io.listen(3000);
    console.log("Server running on port 3000");


    // setInterval(gameLoop, (1000 / (config.get('tps') + 1)));
    console.log("Game loop starting...")

    gameLoop()
    console.log("Game loop started")

}
let startTimeTPS = performance.now();
let startTime = performance.now();
let tps = 0
function gameLoop() {
    // while (true) {
    const elapsedTime = performance.now() - startTime;
    if (elapsedTime < (1000 / (config.get('tps')))) {
        setImmediate(gameLoop)
        return
    }
    startTime = performance.now();
    if (performance.now() - startTimeTPS >= 1000) {
        if (config.get('debug')) {

            console.table({ "TPS": tps, "MSPT": elapsedTime });
        }
        tps = 0;
        startTimeTPS = performance.now();
    }
    else {
        tps++;
    }

    io.emit("sync", {entities: []});
    setImmediate(gameLoop)
    // }
}
main()

