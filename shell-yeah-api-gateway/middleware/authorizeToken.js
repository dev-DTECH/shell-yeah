import {configDotenv} from "dotenv"
import jwt from "jsonwebtoken"

configDotenv()
export default function authorizeToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({error: "Unauthorized User"})
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err instanceof jwt.TokenExpiredError)
            return res.status(403).json({error: "Token expired", isExpired: true})

        if (err) return res.status(403).json({error: "Invalid token"})
        req.user = user
        next()
    })
}