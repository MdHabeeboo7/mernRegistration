const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://127.0.0.1:27017/registration")
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/registration";
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log(" connected to mongodb successfully")
}).catch((err)=>{
    console.log(err)
})