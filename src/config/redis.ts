import {createClient, RedisClientType} from "redis";

import {REDIS} from "./settings";
import logger from "./logger";

export class Redis {
    public static client: RedisClientType;

    public static async initRedis() {

        Redis.client = createClient({
            url: `redis://:${REDIS.password}@${REDIS.host}:${REDIS.port}`,
        });

        Redis.client.on("ready", () => {
            logger.info("Redis connected successfully.");
        });

        Redis.client.on("reconnecting", () => {
            logger.info(`Redis attempting to reconnect...`);
        });

        Redis.client.on("error", (err: any) => {
            if(err.code !== "ECONNREFUSED" || err.code !== "ECONNRESET") {
                logger.error(`Redis connection lost: ${err}`);
            } else {
                logger.error(`Unable to connect to the redis: ${err}`);
                throw err
            }
        });

        await Redis.client.connect();

        logger.info("Connection to the redis has been established successfully.");
    }

    public static async closeRedis() {
        await Redis.client.quit();
        logger.info("Connection to the redis has been closed successfully.");
    }
}
