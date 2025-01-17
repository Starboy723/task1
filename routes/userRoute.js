const express=require("express");
const userRouter=express.Router();
const {handleSignup,handleLogin,handleForgotPassword}=require("../controllers/user");
const { signupValidator, handleValidator, loginValidator, newPasswordValidator } = require("../helper/validators");

userRouter.get("/login",(req,res)=>{
    return res.render("login");
})
userRouter.post("/signup",signupValidator(),handleValidator,handleSignup);
userRouter.post("/login",loginValidator(),handleValidator,handleLogin);
userRouter.post("/forgotpassword",newPasswordValidator(),handleValidator,handleForgotPassword);

module.exports=userRouter;