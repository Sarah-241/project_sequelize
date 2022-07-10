const db = require("../models");
const User = db.authors;
checkDuplicateUsernameOrEmail = async (req, res, next) => {

    console.log('inside verify signup')
  try {
   
    // Email
    user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }
    
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate "
    });
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
//   checkRolesExisted
};
module.exports = verifySignUp;