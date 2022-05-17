require('dotenv').config();
const env = process.env;

const development = {
  username : env.DB_USERNAME,
  password : env.DB_PASSWORD,
  database : "noveland_db",
  host : env.DB_HOST,
  dialect : "mysql",
  logging: false
};

const production = {
  username : env.DB_PROD_USERNAME,
  password : env.DB_PROD_PASSWORD,
  database : "noveland_db",
  host : env.DB_PROD_HOST,
  dialect : "mysql",
};

const test = {
  username : env.DB_USERNAME,
  password : env.DB_PASSWORD,
  database : "noveland_db",
  host : env.DB_HOST,
  dialect : "mysql",
};

module.exports = { development, production, test };