const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chapter', {
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
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chapter',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "Novel_id" },
        ]
      },
      {
        name: "fk_Chapter_Novel1_idx",
        using: "BTREE",
        fields: [
          { name: "Novel_id" },
        ]
      },
    ]
  });
};
