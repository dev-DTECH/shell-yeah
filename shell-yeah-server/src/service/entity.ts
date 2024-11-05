import Entity from "../model/Entity";
import redisClient from "../config/redis";
import {cartesianToGeographic} from "../utils/geometry";
import Player from "../model/Player";
import entity from "../model/Entity";

// export function getAllEntities(arenaId) {
//     return redisClient.zRange(`entities:${arenaId}`, 0, -1);
// }

export async function getEntitiesWithinRadius(arenaId: string, x: number, y: number, radius: number): Promise<Entity[]> {
    const geographicCoordinates = cartesianToGeographic(x, y);
    const nearbyEntityKeys = await redisClient.geoSearch(`arena:${arenaId}`,
        geographicCoordinates,
        {
            radius,
            unit: 'm',
        });

    return await Promise.all(
        nearbyEntityKeys.map(async (entityKey) => {
            const entityId = entityKey.split(":")[1];
            return await getEntityById(entityId);
        })
    );
}

export async function getEntityById(id: string): Promise<Entity> {
    const entityData = JSON.parse(await redisClient.get(`entity:${id}`));
    if (!entityData)
        throw new Error(`Entity with id ${id} not found`);

    const entity = new Entity(entityData) as Player;
    return entity
}

export async function createEntity(entityId: string, arenaId: string) {
    let entity: Entity = new Entity(entityId);

    const geographicCoordinates = cartesianToGeographic(entity.x, entity.y);
    await redisClient.geoAdd(`arena:${arenaId}`, {
        ...geographicCoordinates,
        member: `entity:${entityId}`
    });
    await redisClient.set(`entity:${entityId}`, JSON.stringify(entity));
    return entity;
}

export async function updateEntity(entity: Entity, arenaId: string) {
    const {id, x, y} = entity;
    const geographicCoordinates = cartesianToGeographic(x, y);
    await redisClient.geoAdd(`arena:${arenaId}`, {...geographicCoordinates, member: `entity:${id}`});
    await redisClient.set(`entity:${id}`, JSON.stringify(entity));
}

export async function deleteEntity(entityId: string, arenaId: string | undefined = undefined) {
    console.log(`Deleting entity ${entityId} in arena ${arenaId}`)
    await redisClient.zRem(`arena:${arenaId}`, `entity:${entityId}`);
    await redisClient.del(`entity:${entityId}`);
}