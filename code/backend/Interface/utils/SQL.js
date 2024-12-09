// utils/SQL.js
const mysql = require('mysql2');
const config = require('../config/database.json');

// Create initial pool without database
let pool = mysql.createPool({
    ...config.connection,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

runsql = (sql, value) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log("fail get connection", err);
                return reject(err);
            }
            
            connection.query(sql, value, (err, rows) => {
                connection.release();
                if (err) {
                    console.log("fail run sql", err);
                    return reject(err);
                }
                resolve({ rows });
            });
        });
    });
};

createDatabase = () => {
    return new Promise((resolve, reject) => {
        pool.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`, (err) => {
            if (err) {
                console.log("fail create database", err);
                return reject(err);
            }
            
            // Recreate pool with database selected
            pool = mysql.createPool({
                ...config.connection,
                database: config.database,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            
            resolve();
        });
    });
};

const checkTableExists = () => {
    const sql = `SHOW TABLES`;
    const table = config.table_name
    return runsql(sql, [])
      .then((result)=>{
        const resultTables = result.rows.map(row => row.Tables_in_backend_database);
        const allTablesExist = table.every(tableName => resultTables.includes(tableName));
        if (allTablesExist) {
          console.log("All tables are present in the database.");
          return true;
      } else {
          console.log("Some tables are missing in the database.");
          return false;
      }
      }); // If rows are returned, the table exists
  };

createTables = () => {
    const promises = config.tables.map(table => {
        // Execute each statement in the table array sequentially
        return table.reduce((promise, statement) => {
            return promise.then(() => runsql(statement));
        }, Promise.resolve());
    });

    return Promise.all(promises);
};

initializeDatabase = () => {
    console.log("Initializing database...");
    return createDatabase()
        .then(() => checkTableExists())
        .then((result) => {
            if(!result){
                return createTables()
            }
        })
        .then(
            () => {
                console.log("Database initialization completed");
            },
            (err) => {
                console.log("Database initialization failed", err);
                throw err;
            }
        );
};

// Start initialization with retry mechanism
const initWithRetry = (maxAttempts = 5, delay = 5000) => {
    let attempt = 0;

    const tryInit = () => {
        attempt++;
        console.log(`Attempt ${attempt} to initialize database...`);

        return initializeDatabase()
            .catch(err => {
                if (attempt >= maxAttempts) {
                    throw err;
                }
                console.log(`Attempt ${attempt} failed, retrying in ${delay/1000} seconds...`);
                return new Promise(resolve => setTimeout(resolve, delay))
                    .then(() => tryInit());
            });
    };

    return tryInit();
};

// Start initialization
initWithRetry()
    .catch(err => {
        console.error('Database initialization failed after all attempts:', err);
        process.exit(1);
    });

module.exports = { runsql };