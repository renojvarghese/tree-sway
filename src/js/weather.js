const windScale = 1
const compass = ["North", "North-Northeast", "Northeast", "East-Northeast", "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest", "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];

export class WeatherItem {
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
export class WeatherBox {
    constructor(key, weather_items, lat, lon, ref) {
        this.key = key || "";
        this.ref = ref || "#weather";
        this.lat = lat || 41.27770;
        this.lon = lon || 73.4958;
        this.items = weather_items || {};
        
        this.windScale = windScale;
        this.windDirection = "";
        this._windX = 0;
        this._windY = 0;
        this.windSpeed = 0;

    }

    get windX() { return this._windX; }
    get windY() { return this._windY; }

    updateWind(speed, deg) {
        this.windSpeed = this.windScale * speed;

        let rad = deg * Math.PI / 180;

        this._windX = Math.cos(rad) * this.windSpeed * this.windScale;
        this._windY = Math.sin(rad) * this.windSpeed * this.windScale * -1
    }
    convertDegToCompass(deg) {
        return compass[(Math.floor((deg / 22.5) + 0.5)) % 16]
    }
    refreshWeather() {
        let context = this;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.key}&units=imperial`).then((res,err) => {
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
            t["wind_dir"].updateRef(context.convertDegToCompass(json.wind.deg));
            context.updateWind(json.wind.speed, json.wind.deg)
        });
    }
}
