const mongoose=require("mongoose")
const connect = mongoose.connect("mongodb://127.0.0.1:27017/Login-tut");

//check database connected or not
connect.then(() => {
    console.log("Database is connected successfully");
})
.catch((error) => {
    console.error("Database connection error:", error);
});

//create a schema
const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:Number
    },
    password:{
        type:String,
        required:true
    }
});
//collection part
const collection=new mongoose.model("Users",LogInSchema);
module.exports=collection;