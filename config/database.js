const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('digital_restaurant', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = {
    sequelize
};