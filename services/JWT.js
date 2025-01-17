const JWT=require("jsonwebtoken");
const generateToken=(user)=>{
    const payload={
        id:user._id,
        username:user.username,
    }
    return JWT.sign(payload,process.env.JWT_SECRET);
}

const validateToken=(token)=>{
    return JWT.verify(token,process.env.JWT_SECRET);
}

module.exports={generateToken,validateToken};