Projectile = function (x, y, w, h, vx, vy) {
    let obj = Obj(x-w/2, y-h/2)
    obj.size.Set(w, h)
    obj.vel.Set(vx, vy)

    obj.color = "white"
    obj.collision = true
    obj.moves = true
    obj.projectile = true
    obj.damage = 1

    obj.onCollision = function (other) {
        other.damage(this.damage)
        this.destroy = true
    }

    game.objects.push(obj)
    return obj
}