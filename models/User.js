const { Model, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
}, { sequelize, modelName: 'user', timestamps: false });

module.exports = User;