const router = require('express').Router()

const db = require('../models/index')
const { verifySignUp } = require("../middleware");
const Authors = db.authors
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require('../config/authconfig')


router.post('/signup',[
    verifySignUp.checkDuplicateUsernameOrEmail,
  ],(req,res,next)=>{
    const {author,email,password} = req.body

                Authors.create(
                    {
                        author:author,
                        email:email,
                        password:bcrypt.hashSync(req.body.password, 8)
                    }
                )
                .then((data)=>{
                    console.log(data)
                    res.send({message:'author registered successfully'})    
                })
                .catch(next)
         
})

router.post('/login',(req,res,next)=>{
    console.log(req.body.email)
    Authors.findOne({
        where:{email:req.body.email}
    })
    .then(author => {
        console.log(author)
        if (!author) {
          return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          author.password
        );
        console.log(passwordIsValid)
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        console.log('hi,hi')
        var token = jwt.sign({ id: author.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
        console.log(token)
        
          res.status(200).send({
            id: author.id,
            username: author.author,
            email: author.email,
            
            accessToken: token
          });
       
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
})


module.exports = router