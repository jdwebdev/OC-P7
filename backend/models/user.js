'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post, {
        allowNull:false,
        foreignKey: 'userId',
        // as: 'postUser'
      });
      models.User.hasMany(models.Comment, {
        allowNull:false,
        foreignKey: 'userId',
        as: 'commentUser'
      });
      // models.User.hasMany(models.Like, {
      //   allowNull: false,
      //   foreignKey: 'userId',
      //   as: 'usersLike'
      // });
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