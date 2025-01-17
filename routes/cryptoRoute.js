const { getPrices,setAlert } = require("../controllers/crypto");
const validateUser = require("../middlewares/Authentication");

const cryptoRouter=require("express").Router();

cryptoRouter.use(validateUser("token"));
cryptoRouter.get("/getPrices",getPrices);
cryptoRouter.post("/setAlert",setAlert);

module.exports=cryptoRouter;