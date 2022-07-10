module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define("authorbooks", {
        title: {
            type: Sequelize.STRING,
        },
        author: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
            
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        category: {
            type: Sequelize.STRING,
        },
        sdesc: {
            type: Sequelize.STRING,
        },
        published: {
            type: Sequelize.BOOLEAN,
        }
    });
    return Books;
};