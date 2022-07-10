const express = require("express")
const cors = require("cors");
const bookRoute = require('./routes/book_routes')
const authorRoute = require('./routes/author_routes')
const db = require("./models/index");
const fileUpload = require("express-fileupload");

const app = express()

db.sequelize.sync().then(() => {
    console.log("synced with database");
});

app.use(cors());


app.use(express.json({limit: '50mb'}))


app.use(fileUpload({ createParentPath: true }));



app.use('/book', bookRoute)
app.use('/', authorRoute)

app.use(function (err, req, res, next) {
    console.log(req.body)
    console.log(req.files)
    console.log(req.headers)
    console.log('inside the error handler,U called?')
    res.status(err.status || 500);
    console.log(err)
    res.send(err);
});

app.listen(3000)
