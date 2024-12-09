import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user: any
        }
    }
}
export default function authorizeToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        res.status(401).json({ error: "Unauthorized User" })
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, (err: any, user: any) => {
        if (err instanceof jwt.TokenExpiredError)
            return res.status(403).json({ error: "Token expired", isExpired: true })
        if (err) return res.status(403).json({ error: "Invalid token" })
        req.user = user
        next()
    })
}