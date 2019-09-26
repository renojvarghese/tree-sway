import "phaser";
import { endianness } from "os";

(function() {
var width = document.getElementById("visual").offsetWidth;
var height = document.getElementById("visual").offsetHeight;

var scaleX = 1
var scaleY = 1;
var offsetX = 0;
var offsetY = 0;

var sx = 1;
var sy = 1;
var ox = 0;
var oy = 0;

var config = {
    type: Phaser.WEBGL,
    width: width,
    height: height,
    transparent: false,
    parent: 'visual',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var particles;
var emitter;
var points = [];


var target = [width/2,height/2];
var curr = {x: width/2, y:height/2};
var tweens = null;
var speed = .2;


fetch("http://localhost:3000/").then( res => res.json()).then(json => {
    sx = (width /2  )/ json.maxX
    sy = (height / 2) / json.maxY
    ox = width / 2 - json.avgX * sx;
    oy = height /2 - json.avgY * sy;
    points = json.points;
    
});

setInterval(function () {
    fetch("http://localhost:3000/").then( res => res.json()).then(json => {
    
        points = json.points
    });
}, 10000);


function distance(x1,y1, x2,y2) {
    return Math.sqrt(
        Math.pow(Math.abs(x1 - x2),2) + Math.pow(Math.abs(y1 - y2),2)
    )
}
function preload()
{
    this.load.image('particles', './static/circle.png');
}

function nextPoint(p) {

    var x = offsetX + ox + width/2  + p[0] * sx * scaleX
    var y = offsetY + oy + height/2 + p[1] * sy * scaleY
    return [x,y]
}
function insideCircle(cx,cy,r,x,y) {
    return (x-cx) *(x-cx) + (y-cy) * (y-cy) <= r * r;
}
function movePoint() {
    if (points.length > 0) {
        target = nextPoint(points.shift());
    } 
    else {
       
    }
    console.log(target)
    
    
    // let randX = Math.random()* width;
    // let randY = Math.random()* height;
    // while (!insideCircle(width/2,height/2,200,randX,randY)) {
    //     randX = Math.random()* width;
    //     randY = Math.random()* height;
    // }
    // target = [randX,randY];
    tweens.
        add({
        targets: curr,
        x: { from: curr.x, to: target[0] },
        y: { from: curr.y, to: target[1]},

        
        ease: 'LINEAR',    
        duration: 1000,
        onComplete: movePoint,
        repeat: 0,        
        yoyo: false
    });
}
var winds = [];
var windConfig = [
    {
        alpha: {min: .2, max: .4 },
        scale: 0.02,
        speed: {min: 10, max: 20},
        accelerationY: 0,
        lifespan: { min: 20000, max: 20000 },
        frequency: 500,
        x: width/2,
        y: height/2
    },
    {
        alpha: {min: .3, max: .5 },
        scale: 0.03,
        speed: {min: 10, max: 20},
        accelerationY: 0,
        lifespan: { min: 20000, max: 20000 },
        frequency: 500,
        x: width/2,
        y: height/2
    },
    {
        alpha: {min: .4, max: .6 },
        scale: 0.04,
        speed: {min: 10, max: 20},
        accelerationY: 0,
        lifespan: { min: 20000, max: 20000 },
        frequency: 500,
        x: width/2,
        y: height/2
    }
];
function create ()
{

    particles = this.add.particles('particles');

    emitter = particles.createEmitter({
        alpha: { start: .03, end: 0 },
        scale: { start: .04, end: .04 },
        //tint: { start: 0x165F66, end: 0x165F66 },
        speed: 0,
        accelerationY: 0,
        angle: { min: -85, max: -95 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 10000, max: 10000 },
        blendMode: 1,
        frequency: .01,
        x: width/2,
        y: height/2
    });
    windConfig.forEach(function(config) {
        winds.push(particles.createEmitter(config));
    })
    
    tweens = this.tweens;
    //console.log(this.tweens)
    movePoint();
}

let xOff = -100
let yOff = -100;
function update (time, delta)
{
    
    winds.forEach(function(w) {
        let randX = xOff;
        let randY = yOff;
        if (Math.random() < .5) {
            randX = Math.random() * width;
            if (Math.random() < .5) {
                randY = height - yOff;
            }
            
        }
        else {
            randY = Math.random() * height;
            if (Math.random() < .5) {
                randX = width - xOff;
            }
        }
        w.setPosition(randX, randY)
    })
    
    emitter.setPosition(curr.x,curr.y)
}
    setTimeout(function() {
        winds.forEach(function(w) { w.setGravity(-5,-5) });
    },1000)
})();