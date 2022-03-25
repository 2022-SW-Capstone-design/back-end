var DataTypes = require("sequelize").DataTypes;
var _chapter = require("./chapter");
var _novel = require("./novel");
var _owned_contents = require("./owned_contents");
var _user = require("./user");
var _usercomment = require("./usercomment");

function initModels(sequelize) {
  var chapter = _chapter(sequelize, DataTypes);
  var novel = _novel(sequelize, DataTypes);
  var owned_contents = _owned_contents(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var usercomment = _usercomment(sequelize, DataTypes);

  chapter.belongsToMany(chapter, { as: 'Chapter_Novel_novelID_chapters', through: usercomment, foreignKey: "Chapter_chapterID", otherKey: "Chapter_Novel_novelID" });
  chapter.belongsToMany(chapter, { as: 'Chapter_chapterID_chapters', through: usercomment, foreignKey: "Chapter_Novel_novelID", otherKey: "Chapter_chapterID" });
  usercomment.belongsTo(chapter, { as: "Chapter_chapter", foreignKey: "Chapter_chapterID"});
  chapter.hasMany(usercomment, { as: "usercomments", foreignKey: "Chapter_chapterID"});
  usercomment.belongsTo(chapter, { as: "Chapter_Novel_novel", foreignKey: "Chapter_Novel_novelID"});
  chapter.hasMany(usercomment, { as: "Chapter_Novel_novel_usercomments", foreignKey: "Chapter_Novel_novelID"});
  chapter.belongsTo(novel, { as: "Novel_novel", foreignKey: "Novel_novelID"});
  novel.hasMany(chapter, { as: "chapters", foreignKey: "Novel_novelID"});
  novel.belongsTo(user, { as: "User_user", foreignKey: "User_userID"});
  user.hasMany(novel, { as: "novels", foreignKey: "User_userID"});
  owned_contents.belongsTo(user, { as: "User_user", foreignKey: "User_userID"});
  user.hasMany(owned_contents, { as: "owned_contents", foreignKey: "User_userID"});

  return {
    chapter,
    novel,
    owned_contents,
    user,
    usercomment,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
