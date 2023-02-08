const express = require("express");
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
firstname:{
    type:String,
    required:true,
},
lastname:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true,
    unique:[true,"email already exists"],
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("invalid Email");
        }
    }
},
countryCode:{
    type:String,
    default:"+91",
},
phone:{
    type:String,
    required:true,
    minlength:10,
    trim:true,
},
jobtitle:{
    type:String,
},
password:{
    type:String,
    required:true,
    trim:true,
},
passwordConfirmation:{
    type:String,
    trim:true,
    required:true,
},
tokens:[{
    token:{
        type:String,
        required:true,
    }
}]
})
// jwt
UserSchema.methods.generateAuthToken = async function(){
    try{
const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
this.tokens = this.tokens.concat({token:token})
await this.save();
return token;
    }catch(e){
        res.send(e)

    }
}


// bycrypt
UserSchema.pre("save",async function(next){
if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10);
    this.passwordConfirmation = await bcrypt.hash(this.password,10);
}
next();
})


const Register = new mongoose.model("Register",UserSchema)



module.exports = Register;