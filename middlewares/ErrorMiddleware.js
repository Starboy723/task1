function ErrorMiddleware(err,req,res,next){
    err.message||="internal server error";
    err.status||=500;

    return res.status(err.status).json({
        status:"failed",
        message:err.message,
    })
}

module.exports=ErrorMiddleware;