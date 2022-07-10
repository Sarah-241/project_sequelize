module.exports = (sequelize, Sequelize) => {
    const Author = sequelize.define("bookauthors", {
        author: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        password:{
            type: Sequelize.STRING,
        }
       
    });
    return Author;
};