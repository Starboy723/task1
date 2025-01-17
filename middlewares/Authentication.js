const { validateToken } = require("../services/JWT");

const validateUser=(token_name)=>{
    return (req,res,next)=>{
        const cookie=req?.cookies[token_name];
        if(!cookie) return res.redirect("/user/login");
        try{
            const user=validateToken(cookie);
            req.user=user;
        }catch(e){
            return res.redirect("/user/login");
        }
        return next();
    }
}

module.exports=validateUser;