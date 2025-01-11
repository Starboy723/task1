const mongoose=require("mongoose");
function dbConnection(url){
  return mongoose.connect(url);
}

module.exports=dbConnection;