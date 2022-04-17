//dotenv is  required to save our secret keys in enviroment variables
//enviroment file is a hidden file which is not appear directly
//encryption key ,api key and others 
//install by using npm i dotenv 

require('dotenv').config();
const express=require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const viewpath=path.join(__dirname,'./view');
const mongoose = require('mongoose');
//for encrypt install mongoose-encryption
const encrypt = require('mongoose-encryption');

app.set('view engine', 'ejs');
app.set('views',viewpath);

app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =new mongoose.Schema({
    email:String,
    password:String
});
//to encrypt the password
//const secretkey='mero secrete key';
//we directly does not use secrete here because it is 
//available for all so put into the enviroment instead
//file and use it 
const secretkey =process.env.Secretkey;
console.log(secretkey);
//if encrypt field not mention then it it will encrypt all the fields
//so use encryptedFields

userSchema.plugin(encrypt,{secret:secretkey,encryptedFields:['password']});

const userlist=new mongoose.model('user',userSchema);

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});
app.get('/register', function(req, res){
    res.render('register');
});
app.get('/submit', function(req, res){
    res.render('submit');
});

app.post('/register', function(req, res){
    const newuser=new userlist({
        email: req.body.username,
        password: req.body.password
    })
    newuser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secret');
        }
    });

})

app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    userlist.findOne({email: username},function(err,founduser){
        if(err){
            console.log(err);
        }else{
            if(founduser){
                if(founduser.password===password){
                    res.render('secret');
                }
            }
        }
    })
})

const port=process.env.PORT||3300;
app.listen(port,function(){
    console.log('server is running');
})