const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('criticcomment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Novel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'novel',
        key: 'id'
      }
    },
    Novel_User_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'novel',
        key: 'User_id'
      }
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'criticcomment',
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
        name: "fk_CriticComment_Novel1_idx",
        using: "BTREE",
        fields: [
          { name: "Novel_id" },
          { name: "Novel_User_id" },
        ]
      },
    ]
  });
};
