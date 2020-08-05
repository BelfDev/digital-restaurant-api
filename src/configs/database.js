const { Sequelize } = require('sequelize');

/**
 * Sequelize object representing the postgres database connection.
 */
export const db = new Sequelize('digital_restaurant', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});
