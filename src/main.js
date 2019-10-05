import "./scss/main.scss";
import env from './env.js';
import moment from "moment";


import {init} from "./js/visualization";
import {WeatherItem, WeatherBox} from "./js/weather"
require.context("../static", true);


const vis_manager = init();


const items = {
    temp: new WeatherItem("#temp"),
    humidity: new WeatherItem("#humidity"),
    precip: new WeatherItem("#precip"),
    pressure: new WeatherItem("#pressure"),
    wind_speed: new WeatherItem("#wind-speed"),
    wind_dir: new WeatherItem("#wind-dir")
}


const weather = new WeatherBox(env.weather_key, items);
weather.refreshWeather();
function update(){
    weather.refreshWeather(); 
    vis_manager.windX = weather.windX;
    vis_manager.windY = weather.windY;
    document.getElementById("date").innerHTML = moment().format('ll');  
}
setTimeout(function() {
    weather.refreshWeather(); 
    vis_manager.windX = weather.windX;
    vis_manager.windY = weather.windY;
    document.getElementById("date").innerHTML = moment().format('ll'); 
}, 1000)
setInterval(function() {
    weather.refreshWeather(); 
    vis_manager.windX = weather.windX;
    vis_manager.windY = weather.windY;
    document.getElementById("date").innerHTML = moment().format('ll'); 
}, 1 * 60 * 1000);


