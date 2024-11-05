// config/redisConfig.js
import {createClient} from "redis";

// Configure the Redis client with the server URL
const redisClient = createClient({
    url: process.env.REDIS_URI,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Connect to Redis
(async () => {
    await redisClient.connect();
})();

export default redisClient;
