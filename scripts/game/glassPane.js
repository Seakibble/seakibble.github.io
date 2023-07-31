GlassPane = function (x, y, w, h) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.color = "rgba(200,200,255,0.3)"
    obj.collision = true
    obj.obstructs = true
    obj.breakable = true
    obj.breakingThreshhold = 15
    
    obj.onCollision = function (other, velocity) {
        console.log(velocity)
        if (velocity >= this.breakingThreshhold) {
            this.destroy = true
            audio.glassBreak.play()
        }
    }
    
    return obj
}