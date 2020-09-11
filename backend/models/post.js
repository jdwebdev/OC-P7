'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {

      models.Post.belongsTo(models.User, {
        foreignKey: {
          allowNull:false
        }
      });

      models.Post.hasMany(models.Comment, {
        allowNull:false,
        foreignKey: 'postId',
        as: 'commentPost'
      });

      models.Post.hasMany(models.Like, {
        allowNull:false,
        foreignKey: 'postId',
        as: 'postLike'
      });
      
      models.Post.hasMany(models.Dislike, {
        allowNull:false,
        foreignKey: 'postId',
        as: 'postDislike'
      });
    }
  };
  Post.init({
    // userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};