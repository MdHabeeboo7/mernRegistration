require('dotenv').config();

const express = require("express");
const path = require("path")
const app = express();
const hbs = require("hbs");
const Register = require("./models/reg")
const bcrypt = require("bcryptjs");
var cookieParser = require('cookie-parser');



const auth = require("./middleware/auth")
require("./db/conn")
const PORT= process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.static(static_path));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


app.get("/",(req,res) =>{
    res.render("index")
})
app.get("/register",(req,res) =>{
    res.render("register")
})
app.get("/login",(req,res) =>{
    res.render("login")
})
app.get("/secret", auth ,(req,res)=>{
   res.render("secret")  
})
app.get("/logout",auth , async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((curEle)=>{
            return curEle.token !== req.token
        })
res.clearCookie("jwt");
await req.user.save();
res.status(201).render("logout")
    }catch(e){
        res.status(500).render(e)
    }
})
app.get("/logoutALL",auth , async (req,res)=>{
    try{
        req.user.tokens = [];
res.clearCookie("jwt");
await req.user.save();
res.status(201).render("logoutALL")
    }catch(e){
        res.status(500).render(e)
    }
})



app.post("/register",async (req,res)=>{
    try{

        const password = req.body.password;
        const cpassword = req.body.passwordConfirmation;
        if(password === cpassword){
const registerUser = new Register({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    email:req.body.email,
    countryCode:req.body.countryCode,
    phone:req.body.phone,
    jobtilte:req.body.jobtilte,
    password:password,
    passwordConfirmation:cpassword,
})

// jwt
const token = await registerUser.generateAuthToken();
// password hash
// cookie
res.cookie("jwt",token,{
    expires: new Date(Date.now() + 900000),
    httpOnly:true,
    // secure:true,
});



const saveUser = await registerUser.save();
res.status(201).render("sregister");
        }else{
            response.send("The passwords are not matching")
        }
    }catch(e){
res.status(400).render("invalid")
    }
})

// login
app.post("/login", async (req,res)=>{
try{
const email = req.body.email;
const password = req.body.password;
const userEmail = await Register.findOne({email:email});
// bcrypt
const isMatch = await bcrypt.compare(password,userEmail.password);
// jwt
const token = await userEmail.generateAuthToken();
res.cookie("jwt",token,{
    expires: new Date(Date.now() + 900000),
    httpOnly:true,
    // secure:true,
});



if(isMatch){
    res.status(201).render("success");
}else{
    res.status(400).render("invalid")
}
}catch(e){
    res.status(400).render("invalid")
}
})


app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
})