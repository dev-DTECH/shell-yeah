import {useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useOpenSnackbar} from "../context/SnackbarContext.tsx";
import {useAccessToken, useUser} from "../context/AuthContext.tsx";
import {List, ListItem, ListItemAvatar, ListItemText, TextField} from "@mui/material";
import {KeyboardArrowDown, SendRounded} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

type Message =
    {
        user: {
            id: string,
            username: string
            avatar: string
            fullName?: string
        }
        message: string
        sentAt: Date
    }

function ChatBox({arenaId}: { arenaId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const openSnackbar = useOpenSnackbar()
    const user = useUser()
    const messageRef = useRef<HTMLInputElement>()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const accessToken = useAccessToken()
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (!user) return
        const socket = io("localhost:3000", {
            // WARNING: in that case, there is no fallback to long-polling
            transports: ["websocket", "polling"], // or [ "websocket", "polling" ] (the order matters)
            extraHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        setSocket(socket);
        socket.emit("join_arena", arenaId);

        socket.on("message", (data: Message) => {
            setMessages((messages) => [...messages, data]);
        });
        socket.io.on("reconnect", () => {
            socket.emit("join_arena", arenaId);
            openSnackbar("Reconnected successfully!")
        });
        socket.io.on("reconnect_attempt", (attempt) => {
            openSnackbar(`Reconnecting... ${attempt}`, "warning")
        });
        socket.io.on("reconnect_failed", () => {
            openSnackbar("Reconnection Failed!", "error")
        });
        return () => {
            socket.close()
        }
    }, [arenaId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages]);

    const sendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (socket && messageRef.current) {
            socket.emit("message", {
                user,
                message: messageRef.current.value,
                sentAt: new Date()
            });
            messageRef.current.value = ""
        }
    };

    return (
        <Box sx={{
            position: "fixed",
            bottom: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            boxShadow: "0px 0px 6px #B2B2B2",
            overflow: "hidden",
        }}>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'grey',
                    height: 500,
                    display: isExpanded ? "block" : "none",
                    // padding: isExpanded ? 8: null,
                    overflowY: isExpanded ? "scroll" : "hidden",
                    transition: "height 0.1s ease-in-out"
                }}>
                {
                    messages.map((message, index) =>
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <Avatar src={message.user?.avatar}/>
                            </ListItemAvatar>
                            <ListItemText primary={message.user?.username} secondary={message.message}/>
                        </ListItem>
                    )
                }
                <div ref={messagesEndRef}/>
            </List>
            <form onSubmit={sendMessage}>

                <Box sx={{display: "flex"}}>
                    <IconButton color="primary" aria-label="Expand/Collapse chat"
                                onClick={() => setIsExpanded(isExpanded => !isExpanded)}>
                        <KeyboardArrowDown
                            sx={{rotate: isExpanded ? 0 : "180deg", transition: "rotate 0.1s ease-in-out"}}/>
                    </IconButton>
                    {
                        isExpanded ?
                            <>
                                <TextField autoFocus={isExpanded} label="Type here" variant="filled" required
                                           inputRef={messageRef}/>
                                <IconButton type={"submit"} color="primary" aria-label="Send Message">
                                    <SendRounded/>
                                </IconButton>
                            </>
                            :
                            <Button onClick={() => setIsExpanded(true)}>Expand Chat</Button>
                    }
                </Box>
            </form>
        </Box>

        // <div className="chat-box">
        //     <div className="messages">
        //         {messages.map((message, index) => (
        //             <div key={index} className="message">
        //                 {message}
        //             </div>
        //         ))}
        //     </div>
        //     <input
        //         type="text"
        //         value={message}
        //         onChange={(e) => setMessage(e.target.value)}
        //     />
        //     <button onClick={sendMessage}>Send</button>
        // </div>
    );
}

export default ChatBox;