import {Server, Socket} from "socket.io";
import onDisconnect from "./onDisconnect";
import onPlayerJoin from "./onPlayerJoin";
import onPing from "./ping";
import onJoinArena from "./onJoinArena";
import onMove from "./onMove";

const events = {
    // "disconnect": onDisconnect,
    // "player_join": onPlayerJoin,
    // "ping": onPing
    "join_arena": onJoinArena,
    // "message": onMe,
    "move": onMove
}

export default function registerEvents(socket: Socket, io: Server){
    for(const event in events){
        // console.log(`[${socket.id}] Registering event: ${event}`)
        socket.on(event,(data) => {
            console.log(`[${socket.id}] Event triggered: ${event}`)
            const eventHandler = events[event]
            eventHandler({
                socket,
                data
            })
        })
    }
}