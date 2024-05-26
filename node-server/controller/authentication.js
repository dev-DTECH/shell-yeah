import database from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({error: "Invalid request"})
        return
    }
    const username = req.body.username;
    const password = req.body.password;
    const [users] = await database.query("SELECT * FROM user WHERE username = ? OR email = ?", [username, username])
    if (users.length == 0) {
        res.status(401).json({error: "Invalid username or password"})
        return
    }
    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        res.status(401).json({error: "Invalid username or password"})
        return
    }
    const accessToken = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1s'})

    const refreshToken = jwt.sign({
        username: user.username,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None', secure: true,
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

export const register = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const [userNameUser] = await database.query("SELECT * FROM user WHERE username = ?", [username])
    if (userNameUser.length !== 0) {
        res.status(409).json({error: "Username already exists"})
        return
    }
    const [emailUser] = await database.query("SELECT * FROM user WHERE email = ?", [email])
    if (emailUser.length !== 0) {
        res.status(409).json({error: "Email already exists"})
        return
    }
    await database.execute("INSERT INTO user (username, password, email) VALUES (?,?,?)", [username, hashedPassword, email])
    const [newUser] = await database.query("SELECT * FROM user WHERE username = ?", [username])
    const user = newUser[0]
    const accessToken = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
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

export const refreshToken = async (req, res) => {
    const user = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
    const refreshToken = jwt.sign({
        username: user.username,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None', secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.json({user, accessToken, message: "Token refreshed"})
}

export const logout = async (req, res) => {
    res.json({message: "Logout successful"})
}
