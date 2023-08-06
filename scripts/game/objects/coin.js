Coin = function (x, y) {
    let obj = Obj(x, y)
    obj.size.x = 10
    obj.size.y = 10

    obj.collision = true
    obj.color = "white"
    obj.collectable = true

    obj.onCollision = function (other) {
        if (other.player) {
            game.coinsThisLevel++
            Sound.playSFX('coin')
            this.destroy = true
        }
    }

    game.objects.push(obj)
    Sound.loadSFX('coin')
    return obj
}