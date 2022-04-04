const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('criticcomment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Novel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'novel',
        key: 'id'
      }
    },
    Novel_User_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
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
          { name: "Novel_id" },
          { name: "Novel_User_id" },
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
