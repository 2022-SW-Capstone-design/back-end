// raw query를 Sequelize models로 자동 변환

const SequelizeAuto = require('sequelize-auto');
require('dotenv').config();
const env = process.env;

const auto = new SequelizeAuto(
    "mydb",
    env.DB_USERNAME,
    env.DB_PASSWORD,
    {
        host: env.DB_HOST,
        port: env.DB_PORT,
        dialect: 'mysql',
        directory: './models',
    }
);

auto.run((err) => {
    if(err) throw err;
})