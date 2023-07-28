Obj = function (x, y, w=10, h=10) {
    return {
        pos: Vector(x, y),
        vel: Vector(0, 0),
        size: Vector(w, h),
        color: 'white',
        gravity: false,
        moves: false,
        collision: false,
        obstructs: false,
        grounded: false,
        sticking: false,
        onCollision: null,
        facing: null,
        draw: function () {
            game.camera.RenderObj(this)
        },
        update: function () {
            if (this.gravity && !this.grounded) {
                this.vel.Add(GRAVITY)
            }
            
            this.pos.Add(this.vel)
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

                    if (this.onCollision !== null) this.onCollision(that)
                }
            }
        }
    }
}