import cors from "cors";
import express from "express";
import { createServer } from "http";
import { WebSocketServerManager } from "./Room";


// Set up the Express app and HTTP server
const app = express();
const PORT = process.env.PORT || 8080;
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("Hello World!"));

// Initialize the WebSocket server manager
new WebSocketServerManager(server);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
