import assert from "assert";
import mysql from "mysql2/promise";
import logger from "./logger";

class Database {
    private connectionPool: mysql.Pool;

    constructor(connectionURI: string) {
        this.connectionPool = mysql.createPool(connectionURI);
    }

    async query(sql: string, values: string[] = []): Promise<Record<string, any>[]> {
        let rows: Record<string, any>[] = [];
        if (values.length > 0) {
            rows = (await this.connectionPool.query(sql, values))[0] as Record<string, any>[];
        } else {
            rows = (await this.connectionPool.query(sql))[0] as Record<string, any>[];
        }
        logger.debug(`Query: ${sql} returned ${rows.length} rows`);
        logger.debug(rows);
        return rows
    }
}

assert(process.env["DATABASE_URI"], "DATABASE_URI environment variable must be set");

const database = new Database(process.env["DATABASE_URI"]);

export default database;
