const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
require("dotenv").config();

const app=express();

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){

    const sendData={location:"Location",Temperature:"Temp",description:"Description",feel:"Feel-like",humidity:"Humidity",speed:"Speed"};
    res.render("index",{sendData:sendData});
});

app.post('/',function(req,res){
    const location=req.body.city;
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.ApiKey}&units=metric`;
    https.get(url,function(response){
        response.on("data",function(data){
            const weatherData=JSON.parse(data);
            const Temperature=weatherData.main.temp;
            const description=weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
            const imageURL=`https://openweathermap.org/img/wn/${icon}@2x.png`;
            const humidity=weatherData.main.humidity;
            const feel=weatherData.main.feels_like;
            const speed=weatherData.wind.speed;
            sendData={location:location,Temperature:Temperature,description:description,feel:feel,humidity:humidity,speed:speed};
            res.render("index",{sendData:sendData});
        })
        
    });

    
})

app.listen(8080,function(){
    console.log("Server is Running on Port 8080");
});

