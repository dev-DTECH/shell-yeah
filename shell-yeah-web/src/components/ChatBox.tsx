import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

function ChatBox({arenaId}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io("localhost:3000", {
            // WARNING: in that case, there is no fallback to long-polling
            transports: ["websocket", "polling"] // or [ "websocket", "polling" ] (the order matters)
        });
        setSocket(socket);
        socket.emit("joinArena", arenaId);

        socket.on("chat", (data: string) => {
            setMessages([...messages, data]);
        });
        return () => {
            socket.close()
        }
    }, []);

    const sendMessage = () => {
        if (socket) {
            socket.emit("message", message);
            setMessage("");
        }
    };

    return (
        <div className="chat-box">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        {message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatBox;