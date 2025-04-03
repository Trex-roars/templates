import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";


// Define types for clarity
interface User {
    id: number;
    name: string;
    socket: WebSocket;
}

interface Message {
    type: string;
    [key: string]: any;
}



export class WebSocketServerManager {
    private wss: WebSocketServer;
    private Users: Map<number, User> = new Map();
    private userIdCounter = 1;

    constructor(server: ReturnType<typeof createServer>) {
        this.wss = new WebSocketServer({ server });
        this.wss.on("connection", (ws: WebSocket) => this.handleConnection(ws));
    }

    // Broadcast a message to all connected clients
    private broadcast(data: Message): void {
        const message = JSON.stringify(data);
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    // Handle a new client connection
    private handleConnection(ws: WebSocket): void {
        const userId = this.userIdCounter++;
        const newUser: User = {
            id: userId,
            name: `User${userId}`,
            socket: ws,
        };

        this.Users.set(userId, newUser);

        // Send initial messages to the connected client
        this.sendMessage(ws, { type: "userId", userId });
        this.sendMessage(ws, { type: "status", message: "Connected to WebSocket server" });

        // Broadcast that a new user has joined and update the user list
        this.broadcast({ type: "newUser", user: { id: userId, name: newUser.name } });
        this.broadcast({
            type: "userList",
            users: Array.from(this.Users.values()).map(({ id, name }) => ({ id, name })),
        });

        ws.on("message", (message: WebSocket.RawData) => this.handleMessage(message, userId));
        ws.on("close", () => this.handleDisconnect(userId));
        ws.on("error", (err) => console.error(`WebSocket error (User${userId}):`, err));
    }

    // Handle incoming messages and broadcast them to all clients
    private handleMessage(message: WebSocket.RawData, userId: number): void {
        const textMessage = JSON.parse(message.toString("utf-8"));
        console.log(`Received message from User${userId}:`, textMessage);

        this.broadcast({
            type: "message",
            message: textMessage,
            userId,
        });
    }

    // Handle client disconnection and notify all remaining clients
    private handleDisconnect(userId: number): void {
        this.Users.delete(userId);
        this.broadcast({ type: "userDisconnected", userId });
    }

    // Utility to send a message to a specific client
    private sendMessage(ws: WebSocket, data: Message): void {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }
}
