Obj = function (x, y) {
    return {
        pos: Vector(x, y),
        vel: Vector(0, 0),
        size: Vector(10, 10),
        color: 'white',
        gravity: false,
        moves: false,
        collision: false,
        grounded: false,
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
        }
    }
}