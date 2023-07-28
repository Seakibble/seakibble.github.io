Goal = function (x, y, w, h) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.color = "goldenrod"
    obj.collision = true

    obj.onCollision = function () {
        game.win()
    }

    return obj
}