const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('novel', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    User_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    genre: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    coverFileName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    defaultPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    chapterNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'novel',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "User_id" },
        ]
      },
      {
        name: "novelID_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_Novel_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_id" },
        ]
      },
    ]
  });
};
