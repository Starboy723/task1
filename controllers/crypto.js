const tryCatch = require("../utils/utils");
const alertModel=require("../models/alerts");
const axios=require("axios");

const getPrices=tryCatch(async (req,res,next)=>{
   // const {data}=await axios.get(`http://api.coinlayer.com/api/live?access_key=${process.env.API_KEY}`);
    return res.render("crypto",{cssFile:"/styles.css"});
});

const setAlert=tryCatch(async(req,res,next)=>{
    const {crypto_symbol,target_price,direction}=req.body;
    const newalert=await alertModel.create({
        user_id:req.user.id,
        crypto_symbol,
        target_price,
        direction,
    });

    return res.render("crypto",{alertStatus:"success",cssFile:"/styles.css"});
})

module.exports={getPrices,setAlert};