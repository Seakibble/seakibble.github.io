Coin = function (x, y) {
    let obj = Obj(x, y)
    obj.size.x = 10
    obj.size.y = 10

    obj.collision = true
    obj.color = "white"
    obj.collectable = true
    obj.phase = null

    obj.onCollision = function (other) {
        if (other.player) {
            game.coinsThisLevel++
            Sound.playSFX('coin')
            this.destroy = true
        }
    }
    obj.draw = function () {
        if (this.phase == null) this.phase = Math.random() * 2 * Math.PI
        let pulse = Pulse(400, 5, this.phase)
        game.camera.Render(Draw(this.pos.x, this.pos.y + pulse, this.size.x, this.size.y, this.color))
    }

    game.objects.push(obj)
    Sound.loadSFX('coin')
    return obj
}