// manages development and production environment keywords
require('dotenv').config();

const config = {
  development: {
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: 'dev_db',
    },
    port: process.env.PORT || 3000,
  },
  production: {
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: 'prod_db',
    },
    port: process.env.PORT || 8000,
  },
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment];
