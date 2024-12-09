import { database } from "@shell-yeah/common";
import jwt from "jsonwebtoken";

import assert from "assert";

assert(process.env["REFRESH_TOKEN_SECRET"], "REFRESH_TOKEN_SECRET environment variable must be set");
assert(process.env["ACCESS_TOKEN_SECRET"], "ACCESS_TOKEN_SECRET environment variable must be set");

const REFRESH_TOKEN_SECRET = process.env["REFRESH_TOKEN_SECRET"];
const ACCESS_TOKEN_SECRET = process.env["ACCESS_TOKEN_SECRET"];


export function generateAccessToken(payload: any) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

export async function generateRefreshToken(payload: any) {
    try {
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: '1d'})
        await database.query("INSERT INTO refresh_token (token) VALUES (?)", [refreshToken])
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