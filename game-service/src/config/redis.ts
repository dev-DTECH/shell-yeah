// config/redisConfig.js
import {createClient} from "redis";

// Configure the Redis client with the server URL

// try to connect to redis server "redis://redis:6379" otherwise use the one from the environment variables

const isRunningInDocker = false;
const redisUrl = isRunningInDocker ? "redis://redis:6379" : process.env.REDIS_URI;

const redisClient = createClient({
    url: redisUrl,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Connect to Redis
(async () => {
    await redisClient.connect();
})();

export default redisClient;
