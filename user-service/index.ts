import { config } from "dotenv";
config();
import userRouter from "./src/route/user";
import express from "express";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { logger } from "@shell-yeah/common";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(pinoHttp({logger}));

app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`user-service is running on port ${PORT}`);
});