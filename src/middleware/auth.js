const jwt = require("jsonwebtoken");
const Register = require("../models/reg");

const auth = async (req,res, next) => {
    try{
const token = req.cookies.jwt;
const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
const user = await Register.findOne({_id:verifyUser._id});
req.token = token;
req.user = user;
next();


    }catch(e){
res.status(401).render("invalidjwt");
    }
}



module.exports = auth;