Obj = function (x, y) {
    return {
        pos: Vector(x, y),
        vel: Vector(0, 0),
        size: Vector(10, 10),
        color: 'white',
        gravity: false,
        moves: false,
        collision: false,
        obstructs: false,
        grounded: false,
        onCollision: null,
        draw: function () {
            ctx.fillStyle = this.color;
            ctx.translate(this.pos.x, this.pos.y)
            ctx.fillRect(0, 0, this.size.x, this.size.y);
            ctx.resetTransform()

            // ctx.beginPath();
            // ctx.translate(this.pos.x, this.pos.y);
            // ctx.arc(0, 0, this.size.x / 2, 0, 2 * Math.PI);
            // ctx.fill();
            // ctx.resetTransform()
        },
        update: function () {
            if (this.gravity && !this.grounded) this.vel.Add(GRAVITY)
            
            this.pos.Add(this.vel)
            Screenwrap(this)
        },
        checkCollision: function () {
            if (!this.collision) return

            for (let i = 0; i < game.objects.length; i++) {
                let that = game.objects[i]
                if (this == that) continue

                if (Collides(this, that)) {
                    if (!this.moves && this.obstructs && that.obstructs) {
                        this.pos.y = that.pos.y - this.size.y
                        this.vel.y = 0
                        if (this.moves) {
                            this.grounded = true
                        }
                    }

                    if (this.onCollision !== null) this.onCollision()
                }
            }
        }
    }
}