import "./scss/main.scss";
import env from './env.js';


import "./js/visualization.js";
require.context("../static", true);


class WeatherItem {
    constructor(ref) {
        this.ref = ref;
        this.node = document.querySelector(ref);
    }
    updateRef(new_data) {
        if (!this.node) {
            console.log("CANNOT FIND: " + this.ref);
        }
        this.node.innerHTML = "" + new_data;
    }
    
}
class WeatherBox {
    constructor(key, weather_items, lat, lon, ref) {
        this.key = key || "";
        this.ref = ref || "#weather";
        this.lat = lat || 41.27770;
        this.lon = lon || 73.4958;
        this.items = weather_items || {};

    }

    refreshWeather() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.key}`).then((res,err) => {
            if (err){
                return console.log(err);
            }
            return res.json();
        }).then(json => {
            let t = this.items;
            t["temp"].updateRef(json.main.temp);
            t["humidity"].updateRef(json.main.humidity);
            t["precip"].updateRef(json.weather[0].description);
            t["pressure"].updateRef(json.main.pressure);
            t["wind_speed"].updateRef(json.wind.speed);
            t["wind_dir"].updateRef(json.wind.deg);
            //console.log(JSON.stringify(json));
        });
    }
}

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
setInterval(function(){ weather.refreshWeather(); }, 5000);


fetch("http://localhost:3000/").then( res => res.json()).then(json => console.log(json));