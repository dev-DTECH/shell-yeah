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

const app = express();
app.use(express.json())
app.use(cookieParser())

const BASE_URL = "/api/v1"

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(`${BASE_URL}/user`, userRouter)
app.use(`${BASE_URL}/healthcheck`, healthCheck)

app.use(BASE_URL, (req, res) => {
    res.status(200).json({message: "Shell Yeah - API Gateway"})
});

app.listen(3000, () => {
    console.log(`[Shell Yeah - API Gateway] Listening on port 3000 🚀 -> http://localhost:3000${BASE_URL}`);
});