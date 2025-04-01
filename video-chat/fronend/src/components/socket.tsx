"use client"; // Runs only on the client side
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
}

const WebSocketClient = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{ userId: number; message: string }[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [input, setInput] = useState<string>("");
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "userId":
                    setUserId(data.userId);
                    break;

                case "newUser":
                    setUsers((prev) => [...prev, data.user]);
                    break;

                case "userList":
                    setUsers(Object.values(data.users));
                    break;

                case "message":
                    setMessages((prev) => [
                        ...prev,
                        { userId: data.userId, message: JSON.stringify(data.message) },
                    ]);
                    break;

                case "userDisconnected":
                    setUsers((prev) => prev.filter((user) => user.id !== data.userId));
                    break;

                default:
                    console.log("Unknown message type:", data);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws && input.trim()) {
            ws.send(input);
            setInput("");
        }
    };

    return (
        <div className="p-4 border rounded shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-3">Next.js WebSocket Chat</h2>

            <div className="mb-3">
                <h3 className="font-semibold">Connected Users:</h3>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} className={user.id === userId ? "font-bold text-green-600" : ""}>
                            {user.name} {user.id === userId && "(You)"}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border p-3 h-40 overflow-y-auto ">
                {messages.map((msg, index) => (
                    <p key={index} className={msg.userId === userId ? "text-blue-600 font-semibold" : ""}>
                        {users.find((u) => u.id === msg.userId)?.name || "Unknown"}: {msg.message}
                    </p>
                ))}
            </div>

            <div className="mt-3 flex">
                <input
                    type="text"
                    className="border p-2 flex-1 rounded mr-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    className=" px-4 py-2 rounded"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default WebSocketClient;
