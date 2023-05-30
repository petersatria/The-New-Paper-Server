'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require("../helpers/helper");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.belongsToMany(models.Article, { through: models.Bookmark })
      Customer.hasMany(models.Bookmark)
    }
  }
  Customer.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is required'
        },
        notEmpty: {
          msg: 'Email is required'
        },
        isEmail: {
          msg: 'Email is not valid'
        }
      },
      unique: {
        msg: 'Email is already registered!'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required'
        },
        notEmpty: {
          msg: 'Password is required'
        },
        len: {
          args: [5, 32],
          msg: 'Minimum password is 5 character'
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  Customer.beforeCreate((customer, options) => {
    customer.password = hashPassword(customer.password)
  })
  return Customer;
};