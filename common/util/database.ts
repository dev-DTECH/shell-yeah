import assert from "assert";
import mysql from "mysql2/promise";

class Database {
    private connectionPool: mysql.Pool;

    constructor(connectionURI: string) {
        this.connectionPool = mysql.createPool(connectionURI);
    }

    async query(sql: string, values: string[] = []): Promise<Record<string, any>[]> {
        if (values.length > 0) {
            return await this.connectionPool.query(sql, values);
        } else {
            return await this.connectionPool.query(sql);
        }
    }
}

assert(process.env["DATABASE_URI"], "DATABASE_URI environment variable must be set");

const database = new Database(process.env["DATABASE_URI"]);

export default database;
