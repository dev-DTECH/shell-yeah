import redisClient from "../config/redis";


export async function getAllArenaIds() {
    return await redisClient.sMembers('arenas');
}

export async function createArena(id: string) {
    await redisClient.sAdd('arenas', id);
}

export async function deleteArena(id: string) {
    await redisClient.sRem('arenas', id);
}

export async function arenaExists(id: string) {
    return await redisClient.sIsMember('arenas', id);
}