function Screenwrap(obj) {
    if (obj.pos.x < -obj.size.x) obj.pos.x += CV.x + obj.size.x * 2
    else if (obj.pos.x > CV.x + obj.size.x) obj.pos.x -= (CV.x + obj.size.x * 2)
    if (obj.pos.y < -obj.size.y) obj.pos.y += CV.y + obj.size.y * 2
    else if (obj.pos.y > CV.y + obj.size.y) obj.pos.y -= (CV.y + obj.size.y * 2)
}


// Checks to see if a box is overlapping with another box, point by point
// NOT SYMETRICAL! This tells you if each corner of a is inside b, will fail if b is inside a!!!
// Call Collides(a,b) AND Collides (b, a) to be sure if there was a collision!
function Collides(a, b) {
    return (IsInside(Vector(a.pos.x, a.pos.y), b) // a top left is inside b?
        || IsInside(Vector(a.pos.x + a.size.x, a.pos.y), b) // a top right is inside b?
        || IsInside(Vector(a.pos.x + a.size.x, a.pos.y + a.size.y), b) // a bottom right is inside b?
        || IsInside(Vector(a.pos.x, a.pos.y + a.size.y), b) // a bottom left is inside b?
    ) 
}

/// Checks to see if a point is inside a box
function IsInside(a, b) {
    return (a.x > b.pos.x && a.x < b.pos.x + b.size.x // a is between box left and right
        && a.y > b.pos.y && a.y < b.pos.y + b.size.y) // a is between box top and bottom
}

function setMusicMenuText() {
    $toggleMusic.innerHTML = 'Toggle Music: ' + (Sound.musicEnabled() ? 'ON' : 'OFF')
}

function setWorkman() {
    if (game.input.workman) game.input.workman = false
    else game.input.workman = true
    
    setWorkmanMenuText()
}
function setWorkmanMenuText() { 
    if (game.input.workman) $keyboardLayout.innerHTML = 'Keyboard: WORKMAN'
    else $keyboardLayout.innerHTML = 'Keyboard: QWERTY'
}

let x = 0
function drawRect(obj) {
    let cameraSpace = game.camera.CameraSpace(obj.pos)
    x = obj
    ctx.fillRect(cameraSpace.x, cameraSpace.y, obj.size.x, obj.size.y)
}


Box = function (x,y,w,h, color='red') {
    return {
        pos: Vector(x, y),
        size: Vector(w, h),
        color: color
    }
}

function LerpVec(a, b, t) {
    let newPos = b.Diff(a)
    newPos.Mult(t)
    return newPos
}

function Pulse(frequency, amplitude) {
    return Math.sin((game.now - game.startTime) / frequency) * amplitude
}

function ChooseRandom(array) {
    return array[Math.floor(Math.random()*array.length)]
}