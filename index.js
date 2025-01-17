const express=require("express");
const dbConnection=require("./dbConnection");
const userRouter=require("./routes/userRoute");
const cryptoRouter=require("./routes/cryptoRoute");
const ejs=require("ejs");
const path=require("path");
const env=require("dotenv");
const cookieparser=require("cookie-parser");
const http=require("http");
const {Server}=require("socket.io");
const ErrorMiddleware = require("./middlewares/ErrorMiddleware");
const fetchPrices=require("./services/fetchPrices");
const { validateToken } = require("./services/JWT");
const validateUser = require("./middlewares/Authentication");
const alertModel = require("./models/alerts");


const app=express();
const server=http.createServer(app);
const io=new Server(server);//websocket
const Redis = require('ioredis');


//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieparser());
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
env.config();

//database connection
dbConnection("mongodb://localhost:27017/internship")
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e));
const redis = new Redis({
    host: 'localhost',  // Redis server hostname
    port: 6379,         // Redis server port
});
//routes
app.get("/",(req,res)=>{
    return res.render("home",{cssFile:"/styles.css"});
});
app.use(express.static("public"));
app.use("/user",userRouter);
app.use(validateUser("token"));
app.use("/crypto",cryptoRouter);
app.use(ErrorMiddleware);


let activeClients=0;
let intervelID;

const broadCasting = async () => {
    try {
        // Fetch updated prices from Redis or API
        let prices = await redis.get('cryptoPrices');
        
        if (!prices) {
            prices = await fetchPrices();
            // Cache the prices in Redis for 1 minute
            await redis.set('cryptoPrices', JSON.stringify(prices), 'EX', 60);
        } else {
            prices = JSON.parse(prices); // Parse cached prices
        }

        // Emit updated prices to clients
        io.emit("prices", prices);

        // Convert prices array into a Map for quick lookup by symbol
        const pricesMap = new Map(prices.map((priceData) => [priceData.symbol, priceData.price]));

        // Query active alerts from Redis
        let alerts = await redis.get('activeAlerts');
        if (!alerts) {
            console.log('Fetching active alerts from MongoDB');
            alerts = await alertModel.find({ is_active: true });
            // Cache active alerts in Redis for 1 minute
            await redis.set('activeAlerts', JSON.stringify(alerts), 'EX', 60);
        } else {
            alerts = JSON.parse(alerts); // Parse cached alerts
        }

        // Check each alert against the corresponding price
        alerts.forEach(async (alert) => {
            if (!alert.crypto_symbol) {
                console.warn(`Alert with missing crypto_symbol: ${JSON.stringify(alert)}`);
                return; // Skip alerts without a valid symbol
            }

            const currentPrice = pricesMap.get(alert.crypto_symbol);

            if (currentPrice !== undefined) {
                // Check if the alert condition is met
                if (alert.is_active &&(
                    (alert.direction === "above" && currentPrice > alert.target_price) ||
                    (alert.direction === "below" && currentPrice < alert.target_price))
                ) {
                    // Emit alert notification to all clients
                    io.emit("alert", {
                        symbol: alert.crypto_symbol,
                        message: `Price of ${alert.crypto_symbol} is ${
                            alert.direction === "above" ? "above" : "below"
                        } ${alert.target_price}. Current price: ${currentPrice}.`,
                    });

                    // Deactivate the alert in Redis and MongoDB
                    alert.is_active = false;
                    await alertModel.updateOne({ _id: alert._id }, { $set: { is_active: false } });
                    await redis.set('activeAlerts', JSON.stringify(alerts), 'EX', 60);
                }
            } else {
                console.warn(`Price data for symbol ${alert.crypto_symbol} not found.`);
            }
        });
    } catch (error) {
        console.error("Error checking prices and alerts:", error.message);
    }
};


//websockets
io.on("connection",(sockets)=>{
    console.log(`${sockets.id} connected`);
    sockets.on("clientEnteredPage",()=>{
        activeClients++;
        if(activeClients===1){
            broadCasting();
            intervelID=setInterval(broadCasting,5000);
        }
    });
    sockets.on("clientLeftPage",()=>{
        activeClients=Math.max(0,activeClients-1);
        if(activeClients===0 && intervelID){
            clearInterval(intervelID);
            intervelID=null;
        }
    });
    sockets.on("disconnect",()=>{
        console.log("client disconnected");
    });
})

server.listen(5000,()=>console.log("server started"));