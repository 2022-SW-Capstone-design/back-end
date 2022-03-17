'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const initModels = require('./init-models');
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const models = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = models.user;
db.Novel = models.novel;
db.Owned_contents = models.owned_contents;
db.Chapter = models.chapter;

module.exports = db;
