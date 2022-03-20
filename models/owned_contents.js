const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('owned_contents', {
    novelID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chapterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    User_userID: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'userID'
      }
    },
    own: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
          { name: "chapterID" },
          { name: "novelID" },
        ]
      },
    ]
  });
};
