import {configDotenv} from "dotenv"
import jwt from "jsonwebtoken"

configDotenv()
export default function authorizeSocketToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (token == null) return next(new Error("Unauthorized User"))
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err instanceof jwt.TokenExpiredError)
            return res.status(403).json({error: "Token expired", isExpired: true})

        if (err) return res.status(403).json({error: "Invalid token"})
        req.user = user
        next()
    })
}