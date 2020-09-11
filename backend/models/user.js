'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      models.User.hasMany(models.Post, {
        allowNull:false,
        foreignKey: 'userId'
      });

      models.User.hasMany(models.Comment, {
        allowNull:false,
        foreignKey: 'userId',
        as: 'commentUser'
      });
      
      models.User.hasMany(models.Like, {
        allowNull: false,
        foreignKey: 'userId',
        as: 'usersLike'
      });
    }
  };
  User.init({
    username: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    aboutMe: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};