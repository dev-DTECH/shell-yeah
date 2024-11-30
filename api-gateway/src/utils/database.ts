import mysql from "mysql2/promise";

class Database {
    private connection: mysql.Pool;
    constructor(connectionURI: string) {
        this.connection = mysql.createPool(connectionURI);
    }
    async query(sql: string, values: string[]): Promise<any> {
        const [result] = await this.connection.query(sql, values);
        return result;
    }
}

const database = new Database(process.env["DATABASE_URI"] as string);
export default database;
