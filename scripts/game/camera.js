Camera = function () {
    return {
        pos: Vector(0,0),
        tracking: null,
        lag: 0.1,
        renderList: [],
        Track: function (obj) {
            this.tracking = obj
            this.pos.x = obj.pos.x
            this.pos.y = obj.pos.y
        },
        Update: function () {
            if (this.tracking) {
                // console.log(this.pos)
                // this.pos = this.tracking.pos
                this.pos.Add(LerpVec(this.pos, this.tracking.pos, this.lag))
            }
        },
        DrawToScreen: function () {
            this.DrawToScreenArray(this.renderList)
            this.renderList = []
        },
        DrawToScreenArray: function (list) {
            for (let i = 0; i < list.length; i++) {
                let target = list[i]

                ctx.translate(target.x, target.y) // target offset
                ctx.translate(center.x, center.y) // center offset
                ctx.translate(-this.pos.x, -this.pos.y) // tracking offset

                if (target.text !== undefined) { 
                    ctx.font = target.font;
                    ctx.fillStyle = target.styles;
                    ctx.textAlign = target.align;
                    ctx.fillText(target.text, 0,0);
                } else {
                    ctx.fillStyle = target.color
                    ctx.fillRect(0, 0, target.w, target.h)
                }
                ctx.resetTransform()
            } 
        },
        Render: function (drawThis) {
            this.renderList.push(drawThis)
        },
        RenderObj: function (drawThis) {
            this.renderList.push(DrawObj(drawThis))
        }, 
        CameraSpace: function (vec) {
            let newVec = Vector(vec.x, vec.y)
            let otherVec = Vector(this.pos.x + CV.x / 2, this.pos.y + CV.y / 2)
            newVec.Subtract(otherVec)

            return newVec
        }
    }
}

Draw = function (x,y,w,h,color) {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        color: color
    }
}
DrawObjVec = function (pos,size,color) {
    return {
        x: pos.x,
        y: pos.y,
        w: size.x,
        h: size.y,
        color: color
    }
}
DrawObj = function (obj) {
    return {
        x: obj.pos.x,
        y: obj.pos.y,
        w: obj.size.x,
        h: obj.size.y,
        color: obj.color
    }
}

DrawText = function (x, y, text, styles = '', align = 'center', font = 'bold 40px Red Hat Display') {
    return {
        x: x,
        y: y,
        font: font,
        styles: styles,
        align: align,
        text: text
    }
}