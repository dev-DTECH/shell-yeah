import { config } from "dotenv";
config();
import userRouter from "./src/route/user";
import express, { NextFunction } from "express";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { logger } from "@shell-yeah/common";
import { Request, Response } from "express";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(pinoHttp({logger}));

app.use("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({message: "Shell Yeah - user service"});
});

app.use('/user', userRouter)

app.listen(PORT, () => {
    console.log(`user-service is running on port ${PORT}`);
});