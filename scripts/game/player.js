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
    obj.jumpLate = 0

    obj.colBoxes = {
        size: 3,
        offset: 10,
        Up: function () {
            return Box(this.offset + obj.pos.x, - this.size + obj.pos.y, obj.size.x - this.offset * 2, this.size)
        },
        Down: function () {
            return Box(this.offset + obj.pos.x, obj.size.y + obj.pos.y, obj.size.x - this.offset * 2, this.size)
        },
        Left: function () {
            return Box(-this.size + obj.pos.x, this.offset + obj.pos.y, this.size, obj.size.y - this.offset * 2)
        },
        Right: function () {
            return Box(obj.size.x + obj.pos.x, this.offset + obj.pos.y, this.size, obj.size.y - this.offset * 2)
        }
    }

    obj.checkCollision = function () {
        if (!this.collision) return

        let noGroundCollision = true
        for (let i = 0; i < game.objects.length; i++) {
            let that = game.objects[i]
            if (!this.moves) continue
            if (this == that) continue

            // Collide ground
            if (Collides(this.colBoxes.Down(), that)) {
                this.pos.y = that.pos.y - this.size.y
                this.vel.y = 0
                if (this.moves) {
                    this.grounded = true
                }
                noGroundCollision = false
            }

            // Collide up
            if (Collides(this.colBoxes.Up(), that)) {
                this.pos.y = that.pos.y + that.size.y
                if (this.vel.y < 0) this.vel.y = 0
            }
            // Collide left
            if (Collides(this.colBoxes.Left(), that)) {
                this.pos.x = that.pos.x + that.size.x
                if (this.vel.x < 0) this.vel.x = 0
            }
            // Collide right
            if (Collides(this.colBoxes.Right(), that)) {
                this.pos.x = that.pos.x - this.size.x
                if (this.vel.x > 0) this.vel.x = 0
            }
        }
        if (noGroundCollision) {
            if (this.grounded && this.moves) {
                this.grounded = false
                this.jumpLate = 0
            } else {
                this.jumpLate++
            }
        }
    }

    obj.draw = function () {
        ctx.fillStyle = this.color;
        ctx.translate(this.pos.x, this.pos.y)
        ctx.fillRect(0, 0, this.size.x, this.size.y);
        ctx.resetTransform()

        if (game.debug) {
            ctx.fillStyle = 'red';
            drawRect(this.colBoxes.Up())
            drawRect(this.colBoxes.Down())
            drawRect(this.colBoxes.Left())
            drawRect(this.colBoxes.Right())
        }
        
    }

    return obj
}