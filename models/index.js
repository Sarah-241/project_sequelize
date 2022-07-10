const {HOST,PORT,USER,PASSWORD,DB,dialect} = require('../config/dbconfig')
const Sequelize = require("sequelize");
const sequelize = new Sequelize(DB, USER,PASSWORD, {
    host: HOST,
    port: PORT,
    dialect: dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.books = require('./books')(sequelize, Sequelize);
db.authors = require('./authors')(sequelize, Sequelize);
module.exports = db

db.authors.hasMany(db.books)
db.books.belongsTo(db.authors)





sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });