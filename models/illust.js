const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('illust', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chapter',
        key: 'id'
      }
    },
    Chapter_Novel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chapter',
        key: 'Novel_id'
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'illust',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "Chapter_id" },
          { name: "Chapter_Novel_id" },
        ]
      },
      {
        name: "fk_Illust_Chapter1",
        using: "BTREE",
        fields: [
          { name: "Chapter_id" },
          { name: "Chapter_Novel_id" },
        ]
      },
    ]
  });
};
