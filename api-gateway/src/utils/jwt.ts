import jwt from "jsonwebtoken";
import database from "./database";

export function generateAccessToken(payload: any) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '15m'})
}

export async function generateRefreshToken(payload: any) {
    try {
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: '1d'})
        await database.query("INSERT INTO refresh_token (token) VALUES (?)", [refreshToken]) as Promise<string>
        return refreshToken
    } catch (error) {
        console.log(error)
    }
}

export async function deleteRefreshToken(token: string) {
    try {
        await database.query("DELETE FROM refresh_token WHERE token = ?", [token])
    } catch (error) {
        console.log(error)
    }
}