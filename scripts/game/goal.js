Goal = function (x, y, w, h) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.interactable = true
    obj.color = "goldenrod"
    obj.goal = true

    obj.onInteract = function (other) {
        game.win()
    }

    game.objects.push(obj)
    return obj
}