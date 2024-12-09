import {Socket} from "socket.io";
import {deleteEntity, getEntityById} from "../../service/entity";
import {entities} from "../../data/entities";
import {arenas} from "../../data/arenas";

export default async function onDisconnect(socket: Socket) {
    if (!arenas.has(socket.id)) return
    const arenaId = arenas.get(socket.id)
    delete entities[socket.id]
    await deleteEntity(socket.id, arenaId)
}