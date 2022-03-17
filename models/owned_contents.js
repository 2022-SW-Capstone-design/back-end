const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('owned_contents', {
    novelID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "novelID_UNIQUE"
    },
    chapterID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User_userID: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'userID'
      }
    }
  }, {
    sequelize,
    tableName: 'owned_contents',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "User_userID" },
        ]
      },
      {
        name: "novelID_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "novelID" },
        ]
      },
    ]
  });
};
