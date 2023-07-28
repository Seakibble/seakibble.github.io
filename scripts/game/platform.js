Platform = function (x, y, w, h) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.color = "lightgrey"
    obj.collision = true
    obj.obstructs = true
    
    return obj
}