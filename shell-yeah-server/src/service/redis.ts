import client from "../config/redis";

export const setValue = async (key: string, value: string) => {
    try {
        await client.set(key, value);
        // console.log(`Key set: ${key} => ${value}`);
    } catch (error) {
        console.error("Error setting value in Redis:", error);
    }
};

export const getValue = async (key: string) => {
    try {
        const value = await client.get(key);
        // console.log(`Retrieved value for ${key}: ${value}`);
        return value;
    } catch (error) {
        console.error("Error getting value from Redis:", error);
        return null;
    }
};

export const deleteKey = async (key: string) => {
    try {
        await client.del(key);
        // console.log(`Key deleted: ${key}`);
    } catch (error) {
        console.error("Error deleting key from Redis:", error);
    }
};