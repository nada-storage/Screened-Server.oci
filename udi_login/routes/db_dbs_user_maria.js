// Use the MariaDB Node.js Connector
const mariadb = require('mariadb');
 
// Create a connection pool
const pool = 
  mariadb.createPool({
    host: process.env.DB_dbs_user_maria_host, 
    port: process.env.DB_dbs_user_maria_port,
    user: process.env.DB_dbs_user_maria_user, 
    password: process.env.DB_dbs_user_maria_password,
    database: process.env.DB_dbs_user_maria_database
  });
 
// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
  pool: pool
});
