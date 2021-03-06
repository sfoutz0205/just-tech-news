const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
  // set method to check password
  checkPassword(loginPW) {
    return bcrypt.compareSync(loginPW, this.password);
  }
}

// define table columns and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO HERE
    // define the column
    id: {
      // use SEQUELIZE DataTypes to provide what type of data it is
      type: DataTypes.INTEGER,
      // Sequelize 'NOT NULL' option
      allowNull: false,
      // instruct that this is the Primary Key
      primaryKey: true,
      //  turn on auto increment
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: false,
      // prevent duplicate email values in table
      unique: true,
      // if allowNull is set to false, 
      // we can run our data through validators 
      // before creating the table data
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // this means password must be at least 4 characters
        len: [4]
      }
    }
  },
  {
    hooks: {
      // set up lifecycle "hook" functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    // TABLE CONFIGURATION OPTIONS GO HERE
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;