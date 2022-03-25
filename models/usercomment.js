const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usercomment', {
    type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Chapter_chapterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chapter',
        key: 'chapterID'
      }
    },
    Chapter_Novel_novelID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chapter',
        key: 'Novel_novelID'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usercomment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Chapter_chapterID" },
          { name: "Chapter_Novel_novelID" },
        ]
      },
    ]
  });
};
