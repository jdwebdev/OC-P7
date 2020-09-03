'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.User.belongsToMany(models.Post, {
      //   through: models.Like,
      //   foreignKey: 'userId',
      //   otherKey: 'postId'
      // });

      // //????
      // models.Post.belongsToMany(models.User, {
      //   through: models.Like,
      //   foreignKey: 'postId',
      //   otherKey: 'userId'
      // });

      // models.Like.belongsTo(models.User, {
      //   foreignKey: 'userId',
      //   as: 'userLike'
      // });

      // models.Like.belongsTo(models.Post, {
      //   foreignKey: 'postId',
      //   as: 'postLike'
      // });
    }
  };
  Like.init({
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
    modelName: 'Like',
  });
  return Like;
};