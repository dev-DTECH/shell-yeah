import mysql from "mysql2/promise";

const database = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin@dtech',
    database: 'sales-monkey-db',
})
//
console.log('Database connected')
export default database;