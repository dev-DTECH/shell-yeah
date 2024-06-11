// const app = require('express')();
// const bcrypt = require('bcrypt');
import express from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import authorizeToken from './middleware/authorizeToken.js';
import jwt from 'jsonwebtoken';
import database from "./database.js";
import userRouter from "./route/user.js";
import healthCheck from "./controller/healthCheck.js";
import cookieParser from "cookie-parser";
import * as os from "os";
import http from "node:http";
import {Server} from "socket.io";

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
app.use(`${BASE_URL}/healthcheck`, healthCheck)

app.use(`${BASE_URL}/*`, (req, res) => {
    res.status(404).json({message: "Not Found"})
});

app.use(BASE_URL, (req, res) => {
    res.status(200).json({message: "Shell Yeah - API Gateway"})
});

// Socket
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on("join_arena", async (arenaId) => {
        socket.join(arenaId)
    })
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
    socket.on("message", (data) => {
        console.log(`Received message from ${socket.id}: ${data.message}`);
        const rooms = socket.rooms
        rooms.delete(socket.id)
        const arenaId = Array.from(rooms)[0]
        console.log(`[${arenaId}] [${data.user.username}] : ${data.message}`)
        io.to(arenaId).emit('message', data);
    });
});

server.listen(3000, () => {
    console.log(`[Shell Yeah - API Gateway] Listening on port 3000 🚀 -> http://localhost:3000${BASE_URL}`);
});

