import {configDotenv} from "dotenv"
import jwt from "jsonwebtoken"

configDotenv()
export default function authorizeSocketToken(socket, next) {
    const token = socket.handshake.auth.token
    console.log(token)
    if (token == null) {
        // socket.emit("error", "Unauthorized User")
        return next(new Error("Unauthorized User"))
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err instanceof jwt.TokenExpiredError){
            // socket.emit("error", "Token expired")
            return next(new Error("Token expired"))
        }

        if (err) {
            // socket.emit("error", "Invalid token")
            return next(new Error("Invalid token"))
        }
        socket.user = user
        next()
    })
}