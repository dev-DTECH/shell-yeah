import Player from "../../model/Player";
import {createEntity} from "../../service/entity";
import {Socket} from "socket.io";

export default async function onPlayerJoin({socket, arenaId, join}: {
    socket: Socket,
    arenaId: string,
    join: (room: string) => void
}) {
    await createEntity(socket.id, arenaId);
    join(`arena:${arenaId}`);
}