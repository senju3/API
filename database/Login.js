const Sequelize = require("sequelize");
const connection = require("./connection");
const Login = connection.define('logins', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
Login.sync({force: false})
module.exports = Login;