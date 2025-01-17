const { createHmac,randomBytes } = require("crypto");
const {Schema,model}=require("mongoose");
const ErrorGenerator = require("../utils/ErrorGenerator");
const { generateToken } = require("../services/JWT");

const userSchema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    }
},{timestamps:true});

userSchema.static("validateUser",async function(username,password,next){
    const user=await this.findOne({username:username});
    if(!user) throw new Error("username is wrong");
    const salt=user.salt;
    const hashedPassword=createHmac("sha256",salt)
    .update(password)
    .digest("hex");
    if(hashedPassword!=user.password) throw new Error("password is wrong");
    const token=await generateToken(user);
    return token;
})

userSchema.pre("save",async function(next){
     if(!this.isModified("password")) return next()
     const salt=randomBytes(16).toString();
     const hashedPassword=createHmac("sha256",salt)
     .update(this.password)
     .digest("hex");

     this.salt=salt;
     this.password=hashedPassword;
     return next();
})






const userModel=model("users",userSchema);

module.exports=userModel;