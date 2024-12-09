import {Socket} from "socket.io";

export default async function onMessage({socket, data}: {
    socket: Socket,
    data: string
}) {
    console.log(`[${socket.id}] Message: ${data}`)
    socket.emit('message', {
        id: socket.id,
        message: data
    })
}