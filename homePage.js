////// INITIALIZE
Vector = function (_x, _y) {
    return {
        x: _x,
        y: _y,
        Add: function (_vec) {
            this.x += _vec.x;
            this.y += _vec.y;
        },
        Subtract: function (_vec) {
            this.x -= _vec.x;
            this.y -= _vec.y;
        },
        Diff: function (_vec) {
            return Vector(this.x - _vec.x, this.y - _vec.y);
        },
        Set: function (_x, _y) {
            this.x = _x;
            this.y = _y;
        },
        Mult: function (_n) {
            this.x *= _n;
            this.y *= _n;
        },
        Dist: function (_vec) {
            var diff = this.Diff(_vec);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        },
        Normalize: function (_n) {
            var d = this.Dist(Vector(0, 0));
            return this.Mult(_n / d);
        },
        Report: function () {
            console.log(this.x + ", " + this.y);
        }
    }
};

function Screenwrap(_vec) {
    if (_vec.x > canvas.width) {
        _vec.x -= canvas.width;
    }
    if (_vec.x < 0) {
        _vec.x += canvas.width;
    }
    if (_vec.y > canvas.height) {
        _vec.y -= canvas.height;
    }
    if (_vec.y < 0) {
        _vec.y += canvas.height;
    }
    return _vec;
}


Config = function () {
    config = {
        maxSpeed: 4,
        baseWeight: 5,
        alignment: {
            range: 100,
            weight: 0.8,
        },
        cohesion: {
            range: 300,
            weight: 0.5,
        },
        separation: {
            range: 100,
            weight: 1,
        },
        color: 'rgb(100, 200, 250)',
        predator: false
    };
    return config;
}

ApplyVariance = function (oldConfig) {
    var variance = Math.random() / 20;
    variance = variance - variance / 2;
    var newConfig = Config();

    newConfig.baseWeight = (oldConfig.baseWeight - 5) * variance + 5,
        newConfig.maxSpeed += variance;

    newConfig.alignment.range = (oldConfig.alignment.range / 800 + variance) * 800;
    newConfig.cohesion.range = (oldConfig.cohesion.range / 800 + variance) * 800;
    newConfig.separation.range = (oldConfig.separation.range / 800 + variance) * 800;

    newConfig.alignment.weight = oldConfig.alignment.weight + variance;
    newConfig.cohesion.weight = oldConfig.cohesion.weight + variance;
    newConfig.separation.weight = oldConfig.separation.weight + variance;

    return newConfig;
}

var masterConfig = Config();
var startTime = new Date();

Boid = function (_id, _x, _y, _master) {
    return {
        id: _id,
        pos: Vector(_x, _y),
        velocity: Vector(0, 0),
        config: ApplyVariance(masterConfig),
        master: _master,
        SetVelocity: function (vec) {
            this.velocity = vec;
        },
        SetPos: function (vec) {
            this.pos = vec;
        },
        Draw: function () {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = this.config.color;
            ctx.beginPath();
            let size = 20
            if (container.offsetWidth < 1000) size = 10
                
            ctx.arc(this.pos.x, this.pos.y, (this.config.baseWeight - 4) / 3 * size, 0, Math.PI * 2, true);
            ctx.fill();
        },
        Update: function () {
            // Apply weight of initial velocity
            this.velocity.Mult(this.config.baseWeight);

            // Setup rule variables
            var alignment = { vec: Vector(0, 0), agentCount: 0 };
            var cohesion = { vec: Vector(0, 0), agentCount: 0 };
            var separation = { vec: Vector(0, 0), agentCount: 0 };

            // Collect rule vectors
            for (var i = 0; i < this.master.length; i++) {
                if (this.id !== i) {
                    // Get the relative distance of the other agent from this agent
                    var centerOffset = center.Diff(this.pos);
                    var agentPos = Vector(this.master[i].pos.x, this.master[i].pos.y);
                    agentPos.Add(centerOffset);
                    agentPos = Screenwrap(agentPos);
                    var dist = this.pos.Dist(agentPos);

                    if (dist < this.config.alignment.range && dist > 1) {
                        alignment.agentCount++;
                        alignment.vec.Add(this.master[i].velocity);
                    }

                    if (dist < this.config.cohesion.range && dist > 1) {
                        // Fish follow cohesion, unless the other boid is a predator
                        if (!this.master[i].config.predator) {
                            cohesion.agentCount++;
                            cohesion.vec.Add(agentPos);
                        }
                    }

                    if (dist < this.config.separation.range && dist > 1) {
                        separation.agentCount++;
                        separation.vec.Add(agentPos.Diff(this.pos));
                    }
                }
            }

            // Normalize vectors, apply weights then add to velocity
            if (alignment.agentCount > 0) {
                alignment.vec.Mult(1 / alignment.agentCount);
                alignment.vec.Normalize(this.config.maxSpeed);

                alignment.vec.Mult(this.config.alignment.weight);
                this.velocity.Add(alignment.vec);
            }

            if (cohesion.agentCount > 0) {
                cohesion.vec.Mult(1 / cohesion.agentCount);
                cohesion.vec = cohesion.vec.Diff(this.pos);
                cohesion.vec.Normalize(this.config.maxSpeed);

                cohesion.vec.Mult(this.config.cohesion.weight);
                this.velocity.Add(cohesion.vec);
            }

            if (separation.agentCount > 0) {
                separation.vec.Mult(1 / separation.agentCount);
                separation.vec.Normalize(-this.config.maxSpeed);

                separation.vec.Mult(this.config.separation.weight);
                this.velocity.Add(separation.vec);
            }

            // Normalize for final velocity, then apply
            this.velocity.Normalize(this.config.maxSpeed);
            this.pos.Add(this.velocity);

            // Wrap to other side of the environment if out of frame.
            this.pos = Screenwrap(this.pos);
        }
    }
};

// Resize the canvas to match its container size
function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    center = Vector(canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = 'rgb(70,120,250)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    $sunCanvas.width = $sunContainer.offsetWidth;
    $sunCanvas.height = $sunContainer.offsetHeight;
}





var container = document.getElementById('container');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var center = null;

var $sunContainer = document.getElementById('sunContainer');
var $sunCanvas = document.getElementById('sunCanvas')
var sunCtx = $sunCanvas .getContext('2d')

// Set the canvas size, and add the listener so it resizes properly later
resizeCanvas()
window.addEventListener('resize', resizeCanvas);

// function tap() {
//     console.log('tap')
// }

// canvas.addEventListener('click', tap);



var boids = [];
var boidsCount = 30;
for (var i = 0; i < boidsCount; i++) {
    boids[i] = Boid(i, Math.random() * canvas.width, Math.random() * canvas.height, boids);
    boids[i].SetVelocity(Vector(Math.random() * 2 - 1, Math.random() * 2 - 1));
}

let sharkConfig = Config()
sharkConfig.maxSpeed = 2
sharkConfig.predator = true
sharkConfig.baseWeight = 6.5
sharkConfig.separation.weight = 0.1
sharkConfig.separation.range = 50
sharkConfig.color = 'rgb(150,50,250)'

boids[0].config = sharkConfig

////////////////////////////////////////////////////////////////////////////////////

var fps, fpsInterval, now, then, elapsed;
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animate();
}

function animate() {
    // request another frame
    requestAnimationFrame(animate);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        draw()
    }
}


function init() {
    // ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgb(70,120,250)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    startAnimating(60)
}

let $title = document.getElementById('title')
let $titleMask = document.getElementById('titleMask')
let $surfaceFade = document.getElementById('surfaceFade')
let $starFade = document.getElementById('starFade')
let $skyFade = document.getElementById('skyFade')
let $sunsetFade = document.getElementById('sunsetFade')
let dayTime = 0
let orbitTime = 0
let duskTime = 0
let timeOffset = 0

const max_oh_no = new Image(60, 60)
max_oh_no.src = '/images/max_moon.png'

function drawSun() {
    // get height of the surface canvas
    let surfaceHeight = $skyFade.offsetHeight - 40

    let rays = 6
    let raySpeed = 0.1

    $surfaceFade.style.opacity = dayTime
    $starFade.style.opacity = -dayTime
    $skyFade.style.opacity = dayTime + 0.5
    $sunsetFade.style.opacity = (dayTime + 0.75)*2

    ctx.fillStyle = 'rgb(70,120,250, ' + (dayTime +0.5) + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let sunPos = ($sunCanvas.width - 200) * ((orbitTime +1)/2) + 100

    // sun rays
    for (let i = 0; i < rays; i++) {
        sunCtx.translate(sunPos, $sunCanvas.height - dayTime * surfaceHeight);
        sunCtx.rotate((timeOffset / 1000 * raySpeed) + (360/rays) * i * Math.PI / 180);

        // sunCtx.fillRect(0, -15, 2000, 30);

        sunCtx.beginPath();
        sunCtx.lineTo(0, 15);
        sunCtx.lineTo(0, -15);
        sunCtx.arc(0, 0, 4000, 0, 0.4 * Math.PI / rays);
        sunCtx.fillStyle = "rgb(250, 230, 50, " + 0.35 * dayTime + ")";
        sunCtx.fill();


        sunCtx.resetTransform()
    }

    // daytime Sun
    sunCtx.beginPath();
    sunCtx.translate(sunPos, $sunCanvas.height - dayTime * surfaceHeight);
    sunCtx.arc(0, 0, 50, 0, 2 * Math.PI);
    sunCtx.fillStyle = "rgb(250, 230, 0)";
    sunCtx.fill();
    sunCtx.resetTransform()

    sunCtx.translate(sunPos, $sunCanvas.height - dayTime * surfaceHeight);
    sunCtx.beginPath();
    sunCtx.arc(0, 0, 42, 0, 2 * Math.PI);
    sunCtx.fillStyle = "rgb(250, 250, 0)";
    sunCtx.fill();
    sunCtx.resetTransform()

    // sunset Sun
    sunCtx.beginPath();
    sunCtx.translate(sunPos, $sunCanvas.height - dayTime * surfaceHeight);
    sunCtx.arc(0, 0, 50, 0, 2 * Math.PI);
    sunCtx.fillStyle = "rgb(250, 100, 100, " + duskTime + ")";
    sunCtx.fill();
    sunCtx.resetTransform()

    // sunset Moon
    sunCtx.beginPath();
    sunCtx.translate($sunCanvas.width - sunPos, $sunCanvas.height - -dayTime * (surfaceHeight+80) + 100);
    sunCtx.arc(0, 0, 40, 0, 2 * Math.PI);
    sunCtx.fillStyle = "rgb(255, 255, 255)";
    sunCtx.fill();
    sunCtx.drawImage(max_oh_no, -40, -40, 80, 80)
    sunCtx.resetTransform()



    // underwater
    for (let i = 0; i < rays; i++) {
        ctx.translate(sunPos, $sunCanvas.height - dayTime * surfaceHeight - $sunCanvas.height);
        ctx.rotate((timeOffset / 1000 * raySpeed) + (360 / rays) * i * Math.PI / 180);
        
        ctx.beginPath();
        ctx.lineTo(0, 15);
        ctx.lineTo(0, -15);
        ctx.arc(0, 0, 4000, 0, 0.4 * Math.PI / rays);
        ctx.fillStyle = "rgb(255, 255, 255, " + 0.1 * dayTime + ")";
        ctx.fill();
        
        ctx.resetTransform()
    }
}

function drawBoat() {
    let now = new Date()
    let timeOffset = now.getTime() - startTime.getTime()
    
    let boatPos = timeOffset * 0.1 % ($sunCanvas.width*2.5)

    sunCtx.translate(boatPos - 100, $sunCanvas.height - 20);

    let boatTime = dayTime * 3 * 255
    sunCtx.fillStyle = 'rgb(' + boatTime + ',' + boatTime + ',' + boatTime + ')';
    sunCtx.fillRect(0, 0, 50, 20);
    
    sunCtx.fillStyle = 'blue';
    sunCtx.font = "18px Arial";
    sunCtx.fillText("Boat!", 3, 17);
    sunCtx.resetTransform()
}

function draw() {
    // Update day/night time
    let now = new Date()
    let cycleSpeed = 1
    timeOffset = (now.getTime() - startTime.getTime()) * cycleSpeed + 7000

    dayTime = Math.sin((timeOffset) / 10000)
    duskTime = Math.cos((timeOffset) / 5000) * 5 - 4
    orbitTime = Math.sin((timeOffset) / 10000 - 1.6)
    if (dayTime < 0) duskTime = 1


    $titleMask.style.opacity = -dayTime

    sunCtx.clearRect(0, 0, $sunCanvas.width, $sunCanvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSun() 

    ////// UPDATE
    for (var i = 0; i < boidsCount; i++) {
        boids[i].Update();
    }

    ////// RENDER

    // Clear
    // ctx.globalCompositeOperation = 'source-over';

    

    // ctx.fillStyle = 'rgb(70,120,250)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Boids
    for (var i = 0; i < boidsCount; i++) {
        boids[i].Draw();
    }


    // Draw sun
    drawBoat()
}

init();

let letters = document.getElementsByClassName('letter')

for (let i = 0; i < letters.length; i++) {
    let flicker = Math.round(Math.random() * 4 + 1)
    if (flicker <= 2) letters[i].style.animation = "flicker" + flicker + " " + (8 * flicker + Math.random() * 6) + "s linear " + Math.random() * 10 + "s infinite";
};




