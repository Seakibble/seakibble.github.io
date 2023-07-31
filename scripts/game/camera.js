Camera = function () {
    return {
        pos: Vector(0,0),
        tracking: null,
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
                this.pos.Add(LerpVec(this.pos, this.tracking.pos, CAMERA_LAG))
            }
        },
        DrawToScreen: function () {
            // console.log(this.renderList)
            this.renderList.sort((a, b) => {
                if (a.priority > b.priority) return -1
                else if (a.priority < b.priority) return 1
                else return 0
            })
            // console.log(this.renderList)
            // alert()
            this.DrawToScreenArray(this.renderList)
            this.renderList = []
        },
        DrawToScreenArray: function (list) {
            for (let i = 0; i < list.length; i++) {
                let target = list[i]

                ctx.translate(target.x, target.y) // target offset
                ctx.translate(center.x, center.y) // center offset
                ctx.translate(-this.pos.x, -this.pos.y) // tracking offset

                if (target.line) {
                    // line
                    ctx.strokeStyle = target.color;
                    ctx.beginPath()
                    ctx.moveTo(target.x1, target.y1)
                    ctx.lineTo(target.x2, target.y2)
                    
                    ctx.stroke()
                } else {
                    // Rect or text
                    ctx.translate(target.pivot.x, target.pivot.y)
                    ctx.rotate(target.pivot.r)

                    if (target.text !== undefined) {
                        ctx.font = target.font;
                        ctx.fillStyle = target.styles;
                        ctx.textAlign = target.align;
                        ctx.fillText(target.text, -target.pivot.x, -target.pivot.y);
                    } else {
                        ctx.fillStyle = target.color
                        ctx.fillRect(-target.pivot.x, -target.pivot.y, target.w, target.h)
                    }
                }
                ctx.resetTransform()
            } 
        },
        Render: function (drawThis, priority = 5) {
            drawThis.priority = priority
            this.renderList.push(drawThis)
        },
        RenderObj: function (drawThis, priority = 5) {
            let obj = DrawObj(drawThis)
            obj.priority = priority
            this.renderList.push(obj)
        }, 
        CameraSpace: function (vec) {
            let newVec = Vector(vec.x, vec.y)
            let otherVec = Vector(this.pos.x + CV.x / 2, this.pos.y + CV.y / 2)
            newVec.Subtract(otherVec)

            return newVec
        }
    }
}

function getWorldSpace(target) {
    let dest = Vector(target.x, target.y)
    dest.Subtract(center)
    dest.Add(game.camera.pos)
    return dest
}

Pivot = function (x = 0, y = 0, r = 0) {
    return {
        x: x,
        y: y,
        r: r
    }
}
DrawLine = function (x1, y1, x2, y2, color = 'white') {
    return {
        line: true,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        color: color
    }
}

Draw = function (x,y,w,h,color = 'white', pivot = Pivot()) {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        color: color,
        pivot: pivot
    }
}
DrawObjVec = function (pos, size, color, pivot = Pivot()) {
    return {
        x: pos.x,
        y: pos.y,
        w: size.x,
        h: size.y,
        color: color,
        pivot: pivot
    }
}
DrawObj = function (obj, pivot = Pivot()) {
    return {
        x: obj.pos.x,
        y: obj.pos.y,
        w: obj.size.x,
        h: obj.size.y,
        color: obj.color,
        pivot: pivot
    }
}

DrawText = function (x, y, text, styles = '', align = 'center', font = 'bold 40px Red Hat Display', pivot = Pivot()) {
    return {
        x: x,
        y: y,
        font: font,
        styles: styles,
        align: align,
        text: text,
        pivot: pivot
    }
}