import database from "../utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { deleteRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ error: "Invalid request" })
        return
    }
    const username = req.body.username;
    const password = req.body.password;
    const users = await database.query("SELECT * FROM user WHERE username = ? OR email = ?", [username, username])
    if (users.length == 0) {
        res.status(401).json({ error: "Invalid username or password" })
        return
    }
    // const user = users[0]
    const user = {
        id: users[0].id,
        username: users[0].username,
        email: users[0].email
    }
    const passwordMatch = await bcrypt.compare(password, users[0].password)
    if (!passwordMatch) {
        res.status(401).json({ error: "Invalid username or password" })
        return
    }
    const accessToken = generateAccessToken(user)

    const refreshToken = await generateRefreshToken(user)

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        accessToken,
        message: "Login successful"
    })
}

export const register = async (req: Request, res: Response) => {
    const username = req.body.username;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const [userNameUser] = await database.query("SELECT * FROM user WHERE username = ?", [username])
    if (userNameUser.length !== 0) {
        res.status(409).json({ error: "Username already exists" })
        return
    }
    const [emailUser] = await database.query("SELECT * FROM user WHERE email = ?", [email])
    if (emailUser.length !== 0) {
        res.status(409).json({ error: "Email already exists" })
        return
    }
    await database.query("INSERT INTO user (username, password, email) VALUES (?,?,?)", [username, hashedPassword, email])
    const [newUser] = await database.query("SELECT * FROM user WHERE username = ?", [username])
    const user = newUser[0]
    const accessToken = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1d' })
    res.status(201)
        .json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            accessToken,
            message: "User registered successfully"
        })
}

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.jwt
    if (!token) {
        res.status(401).json({ error: "Unauthorized User" })
        return
    }
    const [refreshTokens] = await database.query("SELECT * FROM refresh_token WHERE token = ?", [token])
    if (!refreshTokens?.length) {
        res.status(403).json({ error: "Invalid token" })
        return
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, user: any) => {
        if (err) {
            console.error(err)
            res.status(403).json({ error: "Invalid token" })
            return
        }
        var userDTO = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        await deleteRefreshToken(token)
        const newAccessToken = generateAccessToken(userDTO)
        const newRefreshToken = await generateRefreshToken(userDTO)
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'none', 
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ user: userDTO, newAccessToken, message: "Token refreshed" })
    })
}

export const me = async (req: Request, res: Response) => {
    res.json({ user: req.user })
}

export const logout = async (req: Request, res: Response) => {
    await deleteRefreshToken(req.cookies.jwt)
    res.clearCookie('jwt')
    res.json({ message: "Logout successful" })
}
