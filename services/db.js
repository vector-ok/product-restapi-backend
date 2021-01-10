// edit script and add table name to run in package.json
// run "npm run create" to create the tables.

const pg = require('pg');

require('dotenv').config();

// db  credentials
const config = {
  // remote database config
  user: process.env.USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.USER_PASSWORD,
  ssl: { rejectUnauthorized: false },
  port: process.env.PORT
};

// cloudinary config for image storage
const cloudIt = {
  CLOUD_NAME: process.env.CLOUDINARY_NAME,
  API_KEY: process.env.CLOUD_API_KEY,
  API_SECRET: process.env.CLOUD_API_SECRET
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const createTableUsers = () => {
  const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        userId INT NOT NULL,
        name VARCHAR(128) NOT NULL
      )`;
  pool.query(usersTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createTableOrders = () => {
  const ordersTable = `CREATE TABLE IF NOT EXISTS
      orders(
        id SERIAL PRIMARY KEY,
        product VARCHAR(128) NOT NULL,
        description VARCHAR(300) NOT NULL,
        imageUrl VARCHAR(128) NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
  pool.query(ordersTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

// *********************   ***************

// pool.on('remove', () => {
//   console.log('client removed');
//   process.exit(0);
// });

// export pool and createTables to be accessible  from anywhere within the application
module.exports = {
  createTableUsers,
  createTableOrders,
  pool,
  cloudIt
};

require('make-runnable');
