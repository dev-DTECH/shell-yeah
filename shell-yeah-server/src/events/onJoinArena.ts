import {Socket} from "socket.io";
import {createEntity} from "../service/entity";
import {entities} from "../data/entities";
import {arenaExists, createArena} from "../service/arena";
import {arenas} from "../data/arenas";
import database from "../database";
import Player from "../model/Player";

export default async function onJoinArena({socket, data}: {
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
}) {
    const {arenaId} = data;
    socket.join(`arena:${arenaId}`);
    arenas.set(socket.id, arenaId);

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

    entities[socket.id] = player;
    console.log(`[${socket.id}] Joined arena:${arenaId}`)
}