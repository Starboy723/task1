const ErrorGenerator = require("./ErrorGenerator");

const tryCatch=(passedfunction)=>{
    return async (req,res,next)=>{
    try{
        await passedfunction(req,res,next);
    }
    catch(e){
       return next(new ErrorGenerator(e,404));
    }
}
}

module.exports=tryCatch;