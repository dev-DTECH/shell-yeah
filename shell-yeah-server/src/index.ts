import {config} from "dotenv";

config()


import express from 'express';
import userRouter from "./route/user.js";
import healthCheck from "./controller/healthCheck.js";
import cookieParser from "cookie-parser";
import * as os from "os";
import http from "node:http";
import {Server} from "socket.io";
import tankRouter from "./route/tank.js";
import * as path from "path";
import onPlayerJoin from "./events/onPlayerJoin";
import onDisconnect from "./events/onDisconnect";
import registerEvents from "./events";
import gameloop from "./service/gameloop";
import {createArena} from "./service/arena";
import redisClient from "./config/redis";
import authorizeSocketToken from "./middleware/authorizeSocketToken";

const sockets = {}

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.json())
app.use(cookieParser())

const BASE_URL = "/api/v1"

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(`${BASE_URL}/user`, userRouter)
app.use(`${BASE_URL}/tank`, tankRouter)
app.use(`${BASE_URL}/healthcheck`, healthCheck)


app.use(`${BASE_URL}/*`, (req, res) => {
    res.status(404).json({message: "Not Found"})
});

app.use(BASE_URL, (req, res) => {
    res.status(200).json({message: "Shell Yeah - API Gateway"})
});

app.use(`/assets`, express.static(path.join(__dirname, '../assets')))

// Socket
io.use(authorizeSocketToken)
io.on('connection', (socket) => {
    sockets[socket.id] = socket
    console.log(`Client connected: ${socket.id}`);
    registerEvents(socket, io)
    socket.on("ping", (callback) => {
        callback();
    });
    socket.on('disconnect', async () => {
        delete sockets[socket.id]
        await onDisconnect(socket)
        console.log(`Client disconnected: ${socket.id}`);
    })
});

// Game Loop
gameloop(io)

server.listen(3000, async () => {
    await redisClient.flushDb()
    await createArena("public")
    console.log(`[Shell Yeah - API Gateway] Listening on port 3000 🚀 -> http://localhost:3000${BASE_URL}`);
});

