'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dislike extends Model {
    static associate(models) {
      
      models.Dislike.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      models.Dislike.belongsTo(models.Post, {
        foreignKey: 'postId'
      });
    }
  };
  Dislike.init({
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
    }
  }, {
    sequelize,
    modelName: 'Dislike',
  });
  return Dislike;
};