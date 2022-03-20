const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chapter', {
    chapterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chapterTitle: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    chapterFileName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Novel_novelID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'novel',
        key: 'novelID'
      }
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
          { name: "chapterID" },
          { name: "Novel_novelID" },
        ]
      },
      {
        name: "fk_Chapter_Novel1_idx",
        using: "BTREE",
        fields: [
          { name: "Novel_novelID" },
        ]
      },
    ]
  });
};
