//jshint esversion:6
require("dotenv").config();
const express=require("express");
const app =express();
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

mongoose.connect(process.env.MONGO_URI);

const userSchema=new mongoose.Schema({
  email: String,
  password: String
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User=new mongoose.model("User",userSchema);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.render("home")
});

app.get("/login",function(req,res){
  res.render("login")
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if(!err){
      res.render("secrets");
    } else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if(err){
      console.log(err);
    } else{
      if (foundUser){
        if(foundUser.password == password){
          res.render("secrets");
        }
      }
    }
  })
})

app.listen(3000,function(){
  console.log("Server running at port 3000");
})
