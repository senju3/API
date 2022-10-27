const Sequelize = require('sequelize');
const connection = require('./connection');
const Games = connection.define('games', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, price: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
//Games.sync({force:false})
module.exports = Games