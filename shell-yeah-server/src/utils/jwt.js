import jwt from "jsonwebtoken";
import database from "../database";

export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

export async function generateRefreshToken(payload) {
    try {
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})
        await database.query("INSERT INTO refresh_token (token) VALUES (?)", [refreshToken])
        return refreshToken
    } catch (error) {
        console.log(error)
    }
}

export async function deleteRefreshToken(token) {
    try {
        await database.query("DELETE FROM refresh_token WHERE token = ?", [token])
    } catch (error) {
        console.log(error)
    }
}