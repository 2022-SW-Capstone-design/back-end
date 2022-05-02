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
db.OwnedContent = models.ownedcontent;
db.Chapter = models.chapter;
db.UserComment = models.usercomment;
db.CriticComment = models.criticcomment;
db.Illust = models.illust;
db.Music = models.music;
db.Report = models.report;
db.LikedContent = models.likedcontent;

module.exports = db;
