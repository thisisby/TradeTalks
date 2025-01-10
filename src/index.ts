import cors from "cors";
import cookieParser from "cookie-parser";
import express, {Application} from "express";

import logger from "./config/logger";
import {SERVER_PORT} from "./config/settings";
import {errorHandler} from "./app/middlewares/error.middleware";
import {logging} from "./app/middlewares/logging.middleware";
import {DB} from "./config/database";
import {Redis} from "./config/redis";
import ApplicationRoutes from "./app/routes"
import RunSeeds from "./database";
import {Server} from "socket.io";
import http from "http"
import SocketController from "./app/modules/socket/socket.controller";

const app: Application = express();


app.use(express.json());
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://127.0.0.1',
            'https://all-in-front.vercel.app'
        ],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(logging);

// routes
app.use("/api/v1/", ApplicationRoutes);

app.use(errorHandler)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    // maxHttpBufferSize: 1e8,
});


const socketController = new SocketController(io);

server.listen(SERVER_PORT, async () => {
    await DB.initDB();
    await Redis.initRedis();
    await RunSeeds();
    logger.info(`Server Started on port ${SERVER_PORT}`);
});

process.once("SIGINT", async () => {
    logger.info(`Server Stopped by SIGINT process`);

    await DB.closeDB();
    await Redis.closeRedis();
});
process.once("SIGTERM", async () => {
    logger.info(`Server Stopped by SIGTERM process`);

    await DB.closeDB();
    await Redis.closeRedis();
});



