import {Socket} from "socket.io";
import {updateEntity} from "../service/entity";
import Player from "../model/Player";
import config from "config";
import {entities} from "../data/entities";

export default async function ({socket, data}: {
    socket: Socket,
    data: { key: Record<string, boolean | number> }
}) {
    const clientPlayer = entities[socket.id] as Player
    // console.log(data.key)

    if (data.key.up || data.key.down)
        clientPlayer.velocity.y = config.get('player.speed') * (data.key.up ? 1 : -1)
    else
        clientPlayer.velocity.y = 0
    if (data.key.left || data.key.right)
        clientPlayer.rotationSpeed = config.get('player.rotationSpeed') * (data.key.right ? 1 : -1)
    else
        clientPlayer.rotationSpeed = 0

    clientPlayer.weapon.rotation = Number(data.key.angle)

    // const arenaId = Array.from(socket.rooms)[1]
    // await updateEntity(clientPlayer, arenaId)
}