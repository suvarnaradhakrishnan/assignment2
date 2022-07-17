const express = require('express');
const BookData = require('./src/model/bookdata');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require ('path');
const bodyParser = require('body-parser');
 
const app = new express();
const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/.env'});
app.use(express.static('./dist/frontend'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


username="admin"
password="1234"


function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return TextDecoderStream.status(401).send('Unauthorized request')
    }
    let token=req.headers.authorization.split(' ')[1]
    if(token=='null'){
        return TextDecoderStream.status(401).send('Unauthorized request')
    }
    let payload=jwt.verify(token,'secretKey')
    console.log(payload)
    if(!payload)
    {
        return res.status(401).send('Unauthorized request')
    }
    req.userId=payload.subject
    next()
}

app.post('/api/login',(req,res)=>{
    let userData= req.body

    if(!username){
        res.status(401).send("Invalid username")
    }else
    if(password !== userData.password){
        res.status(401).send("Invalid password")
    }else{
        let payload={subject:username+password}
        let token=jwt.sign(payload,'secretKey')
        res.status(200).send({token})
    }
})

app.post('/api/insert',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    console.log(req.body);
   
    var book = {       
        title : req.body.book.title,
        author : req.body.book.author,
        image : req.body.book.image,
        about : req.body.book.about,
   }       
   var book = new BookData(book);
   book.save();
});

app.get('/api/books',function(req,res){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    BookData.find()
                .then(function(books){
                    res.send(books);
                });
});


app.get('/api/:id',  (req, res) => {
  
    const id = req.params.id;
      BookData.findOne({"_id":id})
      .then((book)=>{
          res.send(book);
      });
  })

app.put('/api/update',(req,res)=>{
    console.log(req.body)
    id=req.body._id,
    title= req.body.title,
    author = req.body.author,
    image = req.body.image,
    about = req.body.about
   BookData.findByIdAndUpdate({"_id":id},
                                {$set:{"title":title,
                                "author":author,
                                "image":image,
                                "about":about}})
   .then(function(){
       res.send();
   })
 })
 

app.delete('/api/remove/:id',(req,res)=>{
 
    id = req.params.id;
    BookData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })


  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
  });

  const PORT = process.env.PORT || 3000;



  app.listen(PORT,()=>{
      console.log(`Server Ready on ${PORT}`);
  });

