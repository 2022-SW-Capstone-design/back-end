var DataTypes = require("sequelize").DataTypes;
var _chapter = require("./chapter");
var _criticcomment = require("./criticcomment");
var _illust = require("./illust");
var _likedcontent = require("./likedcontent");
var _music = require("./music");
var _novel = require("./novel");
var _ownedcontent = require("./ownedcontent");
var _report = require("./report");
var _user = require("./user");
var _usercomment = require("./usercomment");

function initModels(sequelize) {
  var chapter = _chapter(sequelize, DataTypes);
  var criticcomment = _criticcomment(sequelize, DataTypes);
  var illust = _illust(sequelize, DataTypes);
  var likedcontent = _likedcontent(sequelize, DataTypes);
  var music = _music(sequelize, DataTypes);
  var novel = _novel(sequelize, DataTypes);
  var ownedcontent = _ownedcontent(sequelize, DataTypes);
  var report = _report(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var usercomment = _usercomment(sequelize, DataTypes);

  illust.belongsTo(chapter, { as: "Chapter", foreignKey: "Chapter_id"});
  chapter.hasMany(illust, { as: "illusts", foreignKey: "Chapter_id"});
  illust.belongsTo(chapter, { as: "Chapter_Novel", foreignKey: "Chapter_Novel_id"});
  chapter.hasMany(illust, { as: "Chapter_Novel_illusts", foreignKey: "Chapter_Novel_id"});
  music.belongsTo(chapter, { as: "Chapter", foreignKey: "Chapter_id"});
  chapter.hasMany(music, { as: "musics", foreignKey: "Chapter_id"});
  music.belongsTo(chapter, { as: "Chapter_Novel", foreignKey: "Chapter_Novel_id"});
  chapter.hasMany(music, { as: "Chapter_Novel_musics", foreignKey: "Chapter_Novel_id"});
  usercomment.belongsTo(chapter, { as: "Chapter", foreignKey: "Chapter_id"});
  chapter.hasMany(usercomment, { as: "usercomments", foreignKey: "Chapter_id"});
  usercomment.belongsTo(chapter, { as: "Chapter_Novel", foreignKey: "Chapter_Novel_id"});
  chapter.hasMany(usercomment, { as: "Chapter_Novel_usercomments", foreignKey: "Chapter_Novel_id"});
  chapter.belongsTo(novel, { as: "Novel", foreignKey: "Novel_id"});
  novel.hasMany(chapter, { as: "chapters", foreignKey: "Novel_id"});
  criticcomment.belongsTo(novel, { as: "Novel", foreignKey: "Novel_id"});
  novel.hasMany(criticcomment, { as: "criticcomments", foreignKey: "Novel_id"});
  criticcomment.belongsTo(novel, { as: "Novel_User", foreignKey: "Novel_User_id"});
  novel.hasMany(criticcomment, { as: "Novel_User_criticcomments", foreignKey: "Novel_User_id"});
  likedcontent.belongsTo(user, { as: "User", foreignKey: "User_id"});
  user.hasMany(likedcontent, { as: "likedcontents", foreignKey: "User_id"});
  novel.belongsTo(user, { as: "User", foreignKey: "User_id"});
  user.hasMany(novel, { as: "novels", foreignKey: "User_id"});
  ownedcontent.belongsTo(user, { as: "User", foreignKey: "User_id"});
  user.hasMany(ownedcontent, { as: "ownedcontents", foreignKey: "User_id"});
  report.belongsTo(user, { as: "User", foreignKey: "User_id"});
  user.hasMany(report, { as: "reports", foreignKey: "User_id"});

  return {
    chapter,
    criticcomment,
    illust,
    likedcontent,
    music,
    novel,
    ownedcontent,
    report,
    user,
    usercomment,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
