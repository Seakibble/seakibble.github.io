Obj = function (x, y, w=10, h=10) {
    return {
        pos: new Pyre.Vector(x, y),
        vel: new Pyre.Vector(0, 0),
        size: new Pyre.Vector(w, h),
        color: 'white',
        gravity: false,
        moves: false,
        collision: false,
        obstructs: false,
        grounded: false,
        sticking: false,
        onCollision: null,
        facing: null,
        destroy: false,
        center: function () {
            return new Pyre.Vector(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2)
        },
        draw: function () {
            camera.RenderObj(this)
        },
        update: function () {
            if (this.gravity && !this.grounded) {
                this.vel.add(GRAVITY)
            }
            
            this.pos.add(this.vel)
        },
        damage: function (dam) {
            if (this.health) {
                this.health -= dam
                if (this.health <= 0) {
                    if (this.breakable) {
                        if (!this.broken) this.break()
                    } else {
                        this.destroy = true
                    }                    
                }
            }
        },
        checkCollision: function () {
            if (!this.collision) return

            for (let i = 0; i < Data.objects.length; i++) {
                let that = Data.objects[i]

                if (!that.collision) continue
                if (this == that) continue
                if (!this.moves && !that.moves) continue
                let dist = this.pos.distance(that.pos)
                if (dist > this.size.x && dist > this.size.y && dist > that.size.x && dist > that.size.y) continue

                if (Collides(this, that) || Collides(that, this)) {
                    if (this.onCollision !== null) this.onCollision(that)

                    if (!this.moves && this.obstructs && that.obstructs) {
                        this.pos.y = that.pos.y - this.size.y
                        this.vel.y = 0
                        if (this.moves) {
                            this.grounded = true
                        }
                    }
                }
            }
        },
        onDestroy: function () {

        },
        Facing: function () {
            if (this.facing == 'left') return -1
            else if (this.facing == 'right') return 1
            else return 0
        }
    }
}