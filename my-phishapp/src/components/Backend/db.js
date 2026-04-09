// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Creating a connection pool to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST, // your host
    user: process.env.DB_USER, // your username
    password: process.env.DB_PASSWORD, // your password
    database: process.env.DB_NAME, // your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = pool.promise();