import mysql from "mysql2/promise";

const database = mysql.createPool(process.env["DATABASE_URI"]);

export default database;
