function Screenwrap(obj) {
    if (obj.pos.x < -obj.size.x) obj.pos.x += CV.x + obj.size.x * 2
    else if (obj.pos.x > CV.x + obj.size.x) obj.pos.x -= (CV.x + obj.size.x * 2)
    if (obj.pos.y < -obj.size.y) obj.pos.y += CV.y + obj.size.y * 2
    else if (obj.pos.y > CV.y + obj.size.y) obj.pos.y -= (CV.y + obj.size.y * 2)
}

function Collides(a, b) {
    return (IsInside(Vector(a.pos.x, a.pos.y), b)
        || IsInside(Vector(a.pos.x + a.size.x, a.pos.y), b)
        || IsInside(Vector(a.pos.x + a.size.x, a.pos.y + a.size.y), b)
        || IsInside(Vector(a.pos.x, a.pos.y + a.size.y), b)
    ) 
}

function IsInside(a, b) {
    return (a.x > b.pos.x && a.x < b.pos.x + b.size.x
        && a.y > b.pos.y && a.y < b.pos.y + b.size.y)
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


function drawRect(obj) {
    ctx.fillRect(obj.pos.x, obj.pos.y, obj.size.x, obj.size.y)
}


Box = function (x,y,w,h) {
    return {
        pos: Vector(x, y),
        size: Vector(w, h)
    }
}