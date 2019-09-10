import "phaser";

(function() {
var width = document.getElementById("visual").offsetWidth;
var height = document.getElementById("visual").offsetHeight;

var config = {
    type: Phaser.WEBGL,
    width: width,
    height: height,
    backgroundColor: '#000',
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
var x = 0;
var y = 0;
var points = [];



var target = [width/2,height/2];
var curr = {x: 0, y:0};
var tweens = null;
var speed = 0.5;
function distance(x1,y1, x2,y2) {
    return Math.sqrt(
        Math.pow(Math.abs(x1 - x2),2) + Math.pow(Math.abs(y1 - y2),2)
    )
}
function preload()
{
    this.load.image('particles', './static/flare.png');
}

function nextPoint(p) {
    var x = width / 2 + p[0] * 1000
    var y = height / 2 + p[1] * 1000
    return [x,y]
}
function insideCircle(cx,cy,r,x,y) {
    return (x-cx) *(x-cx) + (y-cy) * (y-cy) <= r * r;
}
function movePoint() {
    // if (points.length > 0) {
    //     target = nextPoint(points.shift());
    // } 
    // else {
    //     fetch("http://localhost:3000/").then( res => res.json()).then(json => points = json);
    // }
    let randX = Math.random()* width;
    let randY = Math.random()* height;
    while (!insideCircle(width/2,height/2,200,randX,randY)) {
        randX = Math.random()* width;
        randY = Math.random()* height;
    }
    target = [randX,randY];
    tweens.
        add({
        targets: curr,
        x: { from: curr.x, to: target[0] },
        y: { from: curr.y, to: target[1]},

        
        ease: 'Linear',    
        duration: distance(curr.x,curr.y,target[0],target[1])/speed,
        onComplete: movePoint,
        repeat: 0,            // -1: infinity
        yoyo: false
    });
}
function create ()
{

    particles = this.add.particles('particles');

    emitter = particles.createEmitter({
        alpha: { start: 1, end: 0 },
        scale: { start: 0.5, end: .5 },
        tint: { start: 0x0f945e, end: 0x0f945e },
        speed: 0,
        accelerationY: 0,
        angle: { min: -85, max: -95 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 2000, max: 2000 },
        blendMode: 'ADD',
        frequency: 2,
        x: width/2,
        y: height/2
    });
    tweens = this.tweens;
    //console.log(this.tweens)
    movePoint();
}

function update (time, delta)
{
    //console.log(target)
    //left -= delta;
    //console.log(emitter.x.propertyValue)

    emitter.setPosition(curr.x, curr.y)
    emitter.setGravity(x,y);
    //particles.emitters[0].accelerationY += 100
}

})();