const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('illust', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chapter',
        key: 'id'
      }
    },
    Chapter_Novel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chapter',
        key: 'Novel_id'
      }
    },
    userId: {
      type: DataTypes.STRING(45),
      allowNull: false
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
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true
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
