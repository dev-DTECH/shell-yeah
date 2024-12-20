import {Server, Socket} from "socket.io";
// import onDisconnect from "./onDisconnect";
// import onPlayerJoin from "./onPlayerJoin";
// import onPing from "./ping";
import onJoinArena from "./onJoinArena";
import onMove from "./onVelocityChange";

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
        socket.on(event,(data,callback) => {
            const eventHandler = events[event]
            eventHandler({
                socket,
                data,
                callback
            })
        })
    }
}