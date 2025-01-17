const {Schema,model}=require("mongoose");


const alertSchema=new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"users",
    },
    crypto_symbol:{
       type:String,
    },
    target_price:{
        type:Number,
    },
    direction:{
        type:String,
    },
    is_active:{
        type:Boolean,
        default:true,
    }
},{timestamps:true});

const alertModel=model("alerts",alertSchema);

module.exports=alertModel;