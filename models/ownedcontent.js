const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ownedcontent', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    User_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    novelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    own: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ownedcontent',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_OwnedContent_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_id" },
        ]
      },
    ]
  });
};
