import "./scss/main.scss";
import env from './env.js';


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
setInterval(function(){ 
    weather.refreshWeather(); 
    vis_manager.windX = weather.windX;
    vis_manager.windY = weather.windY;
}, 1000);


