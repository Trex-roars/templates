import cors from "cors";
import express from "express";
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
const PORT = 8080;

const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

const Users = new Map();
let userIdcount = 1;

const broadcast = (data) => {
    const msg = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
};

wss.on("connection", (ws) => {
    const userId = userIdcount++;
    const newUser = {
        id: userId,
        name: `User ${userId}`,
        socket: ws,
    };
    Users.set(userId, newUser);
    console.log("New user connected:", newUser);

    // Send userId to the client
    ws.send(JSON.stringify({
        type: "userId",
        userId,
    }));

    // Broadcast new user
    broadcast({
        type: "newUser",
        user: {
            id: userId,
            name: newUser.name,
        }
    });

    // Broadcast updated user list
    broadcast({
        type: "userList",
        users: Array.from(Users.values()).map(user => ({
            id: user.id,
            name: user.name
        })),
    });

    ws.on("message", (msg) => {

        const data = JSON.parse(msg.toString('utf-8'));
        broadcast({
            type: "message",
            message: data,
            userId,
            timestamp: Date.now(),
        });
    });

    ws.on("close", () => {
        Users.delete(userId);
        console.log(`User ${userId} disconnected.`);

        // Notify others that the user has left
        broadcast({
            type: "userDisconnected",
            userId,
        });

        // Update the user list
        broadcast({
            type: "userList",
            users: Array.from(Users.values()).map(user => ({
                id: user.id,
                name: user.name
            })),
        });
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });

    ws.send(JSON.stringify({
        type: "status",
        message: "Connected to the Server"
    }));
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
