import mysql from "mysql2/promise";

const database = await mysql.createPool(process.env["DATABASE_URI"])
//
console.log('Database connected')
export default database;