const axios=require("axios");
const fetchPrices=async()=>{
            try {
            const pricesResponse = await axios.get(`http://api.coinlayer.com/api/live?access_key=${process.env.API_KEY}`);
            const iconsResponse = await axios.get(`http://api.coinlayer.com/list?access_key=${process.env.API_KEY}`);
           /*  const pricesResponse={
                data:{
                    success:true,
                    rates:{
                        "611":12345,
                        "ABC":400000,

                    }
                }
            }
            const iconsResponse={
                data:{
                    success:true,
                    crypto:{
                        "611":{
                            "symbol": "611",
                            "name": "SixEleven",
                            "name_full": "SixEleven (611)",
                            "max_supply": 611000,
                            "icon_url": "https://assets.coinlayer.com/icons/611.png"
                        },
                        "ABC":{
                            "symbol": "ABC",
                            "name": "AB-Chain",
                            "name_full": "AB-Chain (ABC)",
                            "max_supply": 210000000,
                            "icon_url": "https://assets.coinlayer.com/icons/ABC.png"
                        }
                    }
                }
            } */
                if (pricesResponse.data.success && iconsResponse.data.success) {
                    const prices = pricesResponse.data.rates;
                    const cryptoInfo = iconsResponse.data.crypto;
        
                    const mergedData = Object.entries(prices).map(([symbol, price],index) => {
                        const cryptoDetails = cryptoInfo[symbol] || {};
                        return {
                            index,
                            symbol,
                            price,
                            name: cryptoDetails.name || "Unknown",
                            icon_url: cryptoDetails.icon_url || "",
                        };
                    });
                    return mergedData;
                } else {
                    throw new Error("Failed to fetch data from APIs");
                }
            } catch (error) {
                console.error("Error fetching and merging data:", error.message);
                return [];
            }
}

module.exports=fetchPrices;