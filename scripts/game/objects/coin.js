Coin = function (x, y) {
    let obj = Obj(x, y)
    obj.size.x = 10
    obj.size.y = 10

    obj.collision = true
    obj.color = "lightyellow"
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
        let pivot = Pivot(this.size.x / 2, this.size.y / 2, Math.PI / 4 + pulse)
        game.camera.Render(Draw(this.pos.x, this.pos.y + pulse, this.size.x, this.size.y, this.color, pivot))
    }
    obj.update = function () {
        if (this.pos.distance(game.player.pos) < 100) {
            let toPlayer = Pyre.Vector.lerpDifference(this.pos, game.player.pos, 0.03)
            this.vel.add(toPlayer)
        } else {
            this.vel.multiply(0.5)
        }
        this.pos.add(this.vel)
    },

    game.objects.push(obj)
    Sound.loadSFX('coin')
    return obj
}