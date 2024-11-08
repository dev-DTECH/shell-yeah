import {Socket} from "socket.io";
import {createEntity} from "../service/entity";
import {entities} from "../data/entities";
import {arenaExists, createArena, getAllArenaIds, getArenaMap} from "../service/arena";
import {arenas} from "../data/arenas";
import database from "../database";
import Player from "../model/Player";

export default async function onJoinArena({socket, data, callback}: {
    socket: Socket & {
        user?: {
            id: number
            username: string
        }
    },
    data: {
        arenaId: string
        userId: string
    }
    callback?: (data: any) => void
}) {
    const {arenaId} = data;
    socket.join(`arena:${arenaId}`);
    arenas.set(socket.id, arenaId);

    console.log(arenaId,await getAllArenaIds())

    // Create arena if it doesn't exist
    if (!(await arenaExists(arenaId)))
        await createArena(arenaId);


    const player = await createEntity(socket.id, arenaId)

    player.name = socket.user.username;
    entities[socket.id] = player;
    const [resultSet] = await database.query(`SELECT texture, weapon_texture
                                              FROM user
                                              WHERE id = ?`, [socket.user.id]);
    player.texture = resultSet[0]['texture'];
    player.weapon = {
        damage: 10,
        range: 1,
        rotation: 0,
        texture: resultSet[0]['weapon_texture'],
    }
    console.log("onJoinArena", player)
    let map = await getArenaMap(arenaId);

    if (callback)
        callback({arenaId, map});

    entities[socket.id] = player;
    console.log(`[${socket.id}] Joined arena:${arenaId}`)
}