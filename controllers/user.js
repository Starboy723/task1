const userModel=require("../models/userModel");
const ErrorGenerator = require("../utils/ErrorGenerator");
const tryCatch=require("../utils/utils");


const  handleSignup=tryCatch(async (req,res,next)=>{
   const {username,email,password}=req.body;
    const user=await userModel.create({
        username,
        email,
        password,
    });
    if(!user) return next(new ErrorGenerator("failed!!! user not created",404));
   return res.status(200).json({
    status:"success",
    message:"successfully created user",
   })
});

const handleLogin=tryCatch(async (req,res,next)=>{
 const {username,password}=req.body;
 const token=await userModel.validateUser(username,password,next);
 res.cookie("token",token);
 return res.redirect("/");
})

const handleForgotPassword=tryCatch(async (req,res,next)=>{
    const {username,newPassword}=req.body;
    const user=await userModel.findOne({username});
    if(!user)return next(new ErrorGenerator("user not found",404));

    user.password=newPassword;
    await user.save();

    return res.status(200).json({
        status:"success",
        message:"successfully password chnaged",
    })
});


module.exports={handleSignup,handleLogin,handleForgotPassword};