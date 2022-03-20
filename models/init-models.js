var DataTypes = require("sequelize").DataTypes;
var _chapter = require("./chapter");
var _novel = require("./novel");
var _owned_contents = require("./owned_contents");
var _user = require("./user");

function initModels(sequelize) {
  var chapter = _chapter(sequelize, DataTypes);
  var novel = _novel(sequelize, DataTypes);
  var owned_contents = _owned_contents(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

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
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
