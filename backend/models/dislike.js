'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dislike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Dislike.belongsTo(models.User, {
        foreignKey: 'userId',
        // as: 'userDislike'
      });

      models.Dislike.belongsTo(models.Post, {
        foreignKey: 'postId',
        // as: 'postDislike'
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