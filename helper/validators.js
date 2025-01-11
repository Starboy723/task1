const {body,validationResult}=require("express-validator");
const ErrorGenerator = require("../utils/ErrorGenerator");
const signupValidator=()=>[
  body("username","username field is required").notEmpty(),
  body("email","email should be provided").notEmpty(),
  body("password","password should be provided").notEmpty(),
]

const loginValidator=()=>[
    body("username","username should be provided").notEmpty(),
    body("password","password should be provided").notEmpty(),
]
const newPasswordValidator=()=>[
    body("username","username should be provided").notEmpty(),
    body("newPassword","newPassword should be provided").notEmpty(),
]

const handleValidator=(req,res,next)=>{
    const errors=validationResult(req);
    const error=errors.array().map((each)=>[each.msg]).join(" ")
    if(errors.isEmpty()){
        return next()};
    return next(new ErrorGenerator(error,400));
}

module.exports={signupValidator,loginValidator,newPasswordValidator,handleValidator};