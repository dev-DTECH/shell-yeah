import {config} from "dotenv";

config()


import express from 'express';
import userRouter from "./src/route/user.js";
import healthCheck from "./src/controller/healthCheck.js";
import cookieParser from "cookie-parser";
import * as os from "os";
import http from "node:http";
import {Server} from "socket.io";
import tankRouter from "./src/route/tank.js";
import * as path from "path";
import onPlayerJoin from "./src/events/client/onPlayerJoin";
import onDisconnect from "./src/events/client/onDisconnect";
import registerEvents from "./src/events/client/index";
import gameloop from "./src/service/gameloop";
import {createArena} from "./src/service/arena";
import redisClient from "./src/config/redis";
import authorizeSocketToken from "./src/middleware/authorizeSocketToken";
import ServerEvent from "./src/events/server";
import cors from "cors";

const sockets = {}

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    path: "/game-ws/"
});

io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

app.use(cors())
app.use(express.json())
app.use(cookieParser())

const BASE_URL = "/"

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(`${BASE_URL}/user`, userRouter)
app.use(`${BASE_URL}/tank`, tankRouter)
app.use(`${BASE_URL}/healthcheck`, healthCheck)


app.use(`${BASE_URL}/*`, (req, res) => {
    res.status(404).json({message: "Not Found"})
});

// app.use(BASE_URL, (req, res) => {
//     res.status(200).json({message: "Shell Yeah - API Gateway"})
// });

app.use(`/assets`, express.static('assets'))
// app.use(`/`, express.static('public'))

// Socket
// io.use(authorizeSocketToken)
io.on('connection', (socket) => {
    sockets[socket.id] = socket
    console.log(`Client connected: ${socket.id}`);
    registerEvents(socket, io)
    socket.on("ping", (callback) => {
        callback();
    });
    socket.emit("test", "test")
    socket.on('disconnect', async () => {
        delete sockets[socket.id]
        await onDisconnect(socket)
        console.log(`Client disconnected: ${socket.id}`);
    })
});

// app.use(BASE_URL, (req, res) => {
//     res.status(200).json({message: "Shell Yeah - API Gateway"})
// });
// Server Events
// const serverEvents = new ServerEvent()

// Game Loop
gameloop(io)

const PORT = process.env.PORT || 3000
server.listen(PORT, async () => {
    await redisClient.flushDb()
    await createArena("public")
    console.log(`[game-ws] Server Started 🚀 -> http://localhost:${PORT}${BASE_URL}`);
});