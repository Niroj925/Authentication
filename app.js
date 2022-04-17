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
//for hashing 
//hash is more secure and easy to use
const md5 = require('md5');
//to hasing and salting
const bcrypt=require('bcrypt');
const saltRound=10;//it genrerate 10 salt character 

const session=require('express-session');
const passport = require('passport');
const passportLocalMongoose=require('passport-local-mongoose');


app.set('view engine', 'ejs');
app.set('views',viewpath);

app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static('public'));

app.use(session({
    secret:'mero secret file yehi ho hai gaich',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB");
//mongoose Schema
const userSchema =new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

//to encrypt the password
//const secretkey='mero secrete key'; //must not use here
//we directly does not use secrete here because it is 
//available for all so put into the enviroment instead
//file and use it 
const secretkey =process.env.Secretkey;
//console.log(secretkey);
//if encrypt field not mention then it it will encrypt all the fields
//so use encryptedFields

//userSchema.plugin(encrypt,{secret:secretkey,encryptedFields:['password']});

const userlist=new mongoose.model('user',userSchema);

passport.serializeUser(userlist.serializeUser());
passport.deserializeUser(userlist.deserializeUser());

//let's hashing some text
//console.log(md5('niroj'));
//console.log(md5('niroj'));
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

app.get('/secret',function(req, res){
    if(req.isAuthenticated()){
        res.render('secret');
    }else{
        res.redirect('/login');
    }
})

app.get('/logout',function(req, res){
    req.logout();
    res.redirect('/');
})
app.post('/register', function(req, res){
    
    userlist.register({username: req.body.username}, req.body.password,function(err, user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/secret');
            })
        }
    })
   
    })
   
   app.post('/login', function(req, res){
     
    const user=new userlist({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/secret');
            })
        }
    });
})

const port=process.env.PORT||3300;
app.listen(port,function(){
    console.log('server is running');
})