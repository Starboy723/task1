const express=require("express");
const dbConnection=require("./dbConnection");
const userRouter=require("./routes/userRoute");
const ErrorMiddleware = require("./middlewares/ErrorMiddleware");

const app=express();

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//database connection
dbConnection("mongodb://localhost:27017/internship")
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e));

//routes
app.use("/user",userRouter);
app.use(ErrorMiddleware);

app.listen(5000,()=>console.log("server started"));