'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });

      models.Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  };
  Comment.init({
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model:'Post',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};