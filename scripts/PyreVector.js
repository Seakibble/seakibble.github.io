class Pyre {
    static Vector = class {
        constructor(x = 0, y = 0) {
            this.x = x
            this.y = y
            this._cachedX = x
            this._cachedY = y
            this._cachedMagnitude = null
        }

        add(vec) {
            this.x += vec.x
            this.y += vec.y
            this._clearCachedMagnitude()
            return this
        }
        subtract(vec) {
            this.x -= vec.x
            this.y -= vec.y
            this._clearCachedMagnitude()
            return this
        }
        difference(vec) {
            return new Pyre.Vector(this.x - vec.x, this.y - vec.y)
        }
        set(x,y) {
            this.x = x
            this.y = y
            this._clearCachedMagnitude()
        }
        multiply(n) {
            this.x *= n
            this.y *= n
            this._clearCachedMagnitude()
            return this
        }
        magnitude() {
            if (this._cachedMagnitude === null || this.x !== this._cachedX || this.y !== this._cachedY) {
                this._cachedMagnitude = Math.sqrt(this.x * this.x + this.y * this.y)
                this._cachedX = this.x
                this._cachedY = this.y
            }
            return this._cachedMagnitude
        }
        distance(vec) {
            let diff = this.difference(vec)
            return diff.magnitude()
        }
        normalize(magnitude = 1) {
            let currentMagnitude = this.magnitude() 
            if (currentMagnitude !== 0) return this.multiply(magnitude / currentMagnitude)
            else return this
        }
        clone() {
            return new Pyre.Vector(this.x, this.y)
        }
        lerp(b, t) {
            let diff = Pyre.Vector.lerpDifference(this, b, t)
            return this.add(diff)
        }
        _clearCachedMagnitude() {
            this._cachedMagnitude = null
        }

        static zero() { return new Pyre.Vector(0, 0) }
        static up() { return new Pyre.Vector(0,1) }
        static down() { return new Pyre.Vector(0, -1) }
        static left() { return new Pyre.Vector(-1, 0) }
        static right() { return new Pyre.Vector(1, 0) }
        
        static random(magnitude) {
            let angle = Math.random() * Math.PI * 2
            let heading = new Pyre.Vector(Math.cos(angle), Math.sin(angle))
            if (magnitude) heading.multiply(magnitude)
            return heading
        }
        static randomXY(x = 1, y = 1) {
            return new Pyre.Vector(Math.random()*x, Math.random()*y)
        }

        static _applyRounding(method) {
            this.x = method(this.x)
            this.y = method(this.y)
            this._clearCachedMagnitude()
            return this
        }
        static round() {
            return this._applyRounding(Math.round)
        }
        static floor() {
            return this._applyRounding(Math.floor)
        }
        static ceil() {
            return this._applyRounding(Math.ceil)
        }

        static average(array) {
            if (!Array.isArray(array)) throw new Error("Invalid input: not an array.")
            if (array.length == 0) throw new Error("Invalid input: array is empty.")
            
            let average = new Pyre.Vector()
            for (let i = 0; i < array.length; i++) {
                average.x += array[i].x
                average.y += array[i].y
            }
            return average.multiply(array.length)
        }
        
        static lerpDifference(a, b, t) {
            let diff = b.clone().difference(a)
            return diff.multiply(t)
        }
    }
}