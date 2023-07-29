//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const port = 3000;
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})

const User = new mongoose.model("User",userSchema);

app.listen(port,()=>{
    console.log(`Server Started on port ${port}`)
})

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async (req,res)=>{
    const user = new User({
        email : req.body.username,
        password : md5(req.body.password)
    })
    try{
        const result = await user.save();
        if(result)
            res.render("secrets")
        else
            res.send("Login Failed!")
    }catch(error){
        console.log(error);
    }
})

app.post("/login",async (req,res)=>{
    const username = req.body.username
    const password = md5(req.body.password)
    try{
        const result = await User.findOne({email : username})
        if(result)
        {
            if(result.password === password)
                res.render("secrets")
            else
                res.send("'Password Does not Match...Try Again !'")

        }
        else
            res.send("User Not found...")
    }catch(error){
        res.send(error)
    }
})