const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chapter', {
    chapterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chapterName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    chapterFileName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Chaptercol: {
      type: DataTypes.STRING(45),
      allowNull: true
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
        name: "chapterID_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chapterID" },
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
