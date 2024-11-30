import { configDotenv } from "dotenv"
import jwt from "jsonwebtoken"
import { Socket } from "socket.io";
import { NextFunction } from "express";

configDotenv()

// Add this interface
interface CustomSocket extends Socket {
    user: any;
}

export default function authorizeSocketToken(socket: CustomSocket, next: NextFunction) {
    const token = socket.handshake.auth.token
    if (token == null) {
        // socket.emit("error", "Unauthorized User")
        next(new Error("Unauthorized User"))
        return
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, (err: any, user: any) => {
        if (err instanceof jwt.TokenExpiredError) {
            // socket.emit("error", "Token expired")
            next(new Error("Token expired"))
            return
        }

        if (err) {
            // socket.emit("error", "Invalid token")
            next(new Error("Invalid token"))
            return
        }
        socket.user = user
        next()
    })
}