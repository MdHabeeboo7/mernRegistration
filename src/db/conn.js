const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://127.0.0.1:27017/registration")
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/registration";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //  serverApi: ServerApiVersion.v
  })
.then(()=>{
    console.log(" connected to mongodb successfully")
}).catch((err)=>{
    console.log(err)
})



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const client = new1 MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
