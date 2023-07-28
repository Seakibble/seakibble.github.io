Player = function (x, y) {
    let obj = Obj(x, y)
    obj.size.x = 50
    obj.size.y = 80
    obj.color = "teal"
    obj.gravity = true
    obj.collision = true
    obj.moves = true
    obj.acceleration = 1
    obj.maxSpeed = 10
    obj.jumpPower = 15

    return obj
}