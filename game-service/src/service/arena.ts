import redisClient from "../config/redis";
import generateMap from "../utils/map";
import config from "config";


export async function getAllArenaIds() {
    return await redisClient.sMembers('arenas');
}

export async function createArena(id: string) {
    const map = generateMap(config.get("map_size"))
    await redisClient.set(`map:${id}`, JSON.stringify(map));
    await redisClient.sAdd('arenas', id);

    console.log(`Created arena ${id}`)
}

export async function getArenaMap(id: string): Promise<Record<string, number>> {
    return JSON.parse(await redisClient.get(`map:${id}`));
}

export async function deleteArena(id: string) {
    await redisClient.sRem('arenas', id);
}

export async function arenaExists(id: string) {
    return await redisClient.sIsMember('arenas', id);
}