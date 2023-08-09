DamageBox = function (x, y, w, h, damage = 1) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h
    obj.color = "darkred"

    obj.contactDamage = damage

    obj.collision = true

    obj.onCollision = function (other) {
        if (other.player) other.damage(this.contactDamage)
    }

    Data.objects.push(obj)
    return obj
}