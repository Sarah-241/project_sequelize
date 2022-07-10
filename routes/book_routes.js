const router = require("express").Router()

const { authJwt } = require("../middleware");
const db = require('../models')
const jwt = require("jsonwebtoken");
const config = require("../config/authconfig");
const Books = db.books;
const Authors = db.authors
const path = require('path')

const fs = require('fs')



const { check, validationResult } = require('express-validator');


//create book
router.post('/',
[authJwt.verifyToken],
(req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() })
      return
    }
  
    if (!req.body.title   ||  !req.body.category || !req.body.sdesc) {
        res.status(404).send('Fill the required feilds');
        return;
    }
    if (req.files == null) {
        res.status(404).send('File is required')
        return
    }
    const file = req.files.pdfFile
    if (file.mimetype != 'application/pdf') {
        res.send('pdf format is only supported')
        return
    }
 
    const book = {
        title: req.body.title,
        
        category: req.body.category,
        sdesc: req.body.sdesc,
        published: false,
        bookauthorId:req.userId
    };
    
    Books.create(book,{
        include:Authors,
        
    })
        .then(data => {
            file.mv(`books/${data.id}.pdf`)
            res.status(200).send(data);
        })
        .catch(next);
     
  
        

})


//list all books of an author
router.get('/',[authJwt.verifyToken], (req, res, next) => {

        
        console.log(req.userId)
        
          Books.findAll({include:Authors,
        where:{
            bookauthorId:req.userId
        }})
          .then(data => {
              console.log(data)
              if (data) {
                  res.status(200).send(data);
              }
              else {
                  res.status(404).send({messsage:'Nothing Found'})
              }
          })
          .catch(next);
      
     
   
})

//list single book based on id 
router.get('/:id', [authJwt.verifyToken],(req, res, next) => {

    console.log(req)
    const { id } = req.params

    
        Books.findOne({ include:Authors,where: { id: id } })
        .then(data => {
            console.log(data)
            if (data) {
                res.status(200).send(data)
            }
            else {
                res.status(404).send({message:'Book Not Found'})
            }

        })
        .catch(next);
         
       
    
})


//download a book content
router.get('/download/:id', [authJwt.verifyToken],(req, res, next) => {
    const { id } = req.params
    
    Books.findOne({ where: { id: id } })
    .then(data => {
        console.log(data)
        if (data) {
            res.status(200).download(path.join(__dirname, `../books/${data.id}.pdf`), (err) => {
                if (err)
                    console.log(err)
            })
            
        }
        else {
            res.status(404).send({message:'Book Not Found'})
        }
    })
    .catch(next);
     
    
    
})

//publish or unpublish books
router.patch('/status/:id',[authJwt.verifyToken], (req, res, next) => {

    const { id } = req.params
    console.log(req.body)
    let token = req.headers["x-access-token"];
   
    Books.update(req.body, { where: { id: id } })
        .then(data => {

            console.log(data)
            if (data == 1) { res.status(200).send({message:'Status of Book Updated'}) }
            else {
                res.status(404).send({message:'Not Found'})
            }
        })
        .catch(next)
     
})

//update a book
router.put('/:id',[authJwt.verifyToken],(req, res, next) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) 
    {
        res.status(422).json({ errors: errors.array() })
        return
    }

    const { id } = req.params
    console.log(req.body)
    Books.update(req.body, { where: { id: id } })
    .then(value => {
        if (value == 1) {
            req.files == null ? fs.copyFile(`books/${id}.pdf`,`books/${id}.pdf`,(err)=>{
                if(err){
                    console.log(err)
                }
               
            }) :
            req.files.pdfFile.mv(`books/${id}.pdf`)
            res.status(200).send({message:`Successfully updated Book with id = ${id}`})
        }
        else {
            res.status(404).end({message:'Error in Updating,Not Found'})
        }
    })
    .catch(next)
    
   
   
})


//delete a book
router.delete('/:id', [authJwt.verifyToken],(req, res,next) => {
    const { id } = req.params

    console.log(id)
    Books.destroy({
        where: { id: id }
    })
        .then(value => {
            console.log(value)
            if (value == 1) {
                fs.unlink(path.join(__dirname, `../books/${id}.pdf`), (err) => {
                    if (err) {
                        console.log("error in deleting file")
                    }
                    else {
                        console.log('file removed')
                    }
                })
                res.status(200).send( res.status(200).send({message:`Successfully Deleted Book with id = ${id}`}))
            }
            else {
                res.status(404).send('Error in Deleting,Not Found')
            }

        })
        .catch(next)
   
     
  
  

})


module.exports = router