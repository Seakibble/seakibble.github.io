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
            if (this._magnitude === null || this.x !== this._cachedX || this.y !== this._cachedY) {
                this._magnitude = Math.sqrt(this.x * this.x + this.y * this.y)
                this._cachedX = this.x
                this._cachedY = this.y
            }
            return this._magnitude
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



    static Audio = class {
        constructor() {
            this.volume = {
                master: 1,
                music: 1,
                sfx: 1,
                voice: 1
            }
            this.music = null
            this._enableMusic = true
            this._pauseFade = false
            this._pauseFadeValue = 0.35
            this.sfx = {}
        }
        pauseFade(enabled = null) {
            if (enabled === null) enabled = !this._pauseFade
            this._pauseFade = enabled
            this._updateMusicVolume()
            this._updateSFXVolume()
        }
        stopMusic() {
            this.music.fade(this._calculateVolume('music'), 0, 100)
            this.music.once('fade', () => {
                this.music.stop()
                this.music.volume(this._calculateVolume('music'))
            })
        }
        startMusic() {
            if (this.music && !this.music.playing() && this._enableMusic) this.music.play()
        }
        playSFXNoSpam(name) {
            if (!this.sfx[name].playing()) this.sfx[name].play()
        }
        playSFX(name) {
            this.sfx[name].play()
        }
        setSFXVolume(volume) {
            this.volume.sfx = volume
            this._updateSFXVolume()
        }
        _updateSFXVolume() {
            for (let name in this.sfx) {
                this.sfx[name].volume(this._calculateVolume('sfx'))
            }
        }
        _updateMusicVolume() {
            if (this.music) this.music.volume(this._calculateVolume('music'))
        }
        setMasterVolume(volume) {
            this.volume.master = volume
            this._updateMusicVolume()
            this._updateSFXVolume()
        }
        setMusicVolume(volume) {
            this.volume.music = volume
            this._updateMusicVolume()
        }
        enableMusic(b = true) {
            this._enableMusic = b
            if (this.music) {
                if (this._enableMusic) this.music.play()
                else this.music.stop() 

            }
        }
        musicEnabled() {
            return this._enableMusic
        }
        loadMusic(src) {
            if (this.music) {
                // fade
                this.music.fade(this._calculateVolume('music'), 0, 1000)
                this.music.once('fade', () => { this._loadTrack(src) })
            } else {
                // just go
                this._loadTrack(src)
            }
        }
        _loadTrack(src) {
            this.music = new Howl({
                src: ['scripts/game/audio/music/' + src + '.mp3'],
                loop: true,
                volume: this._calculateVolume('music'),
                html5: true
            })
        }
        loadSFXArray(list) {
            list.forEach(sfx => {
                this.loadSFX(sfx)
            })
        }
        loadSFX(src, name = src) {
            this.sfx[name] = new Howl({
                src: ['scripts/game/audio/sfx/' + src + '.mp3'],
                volume: this._calculateVolume('sfx'),
            })
        }
        _calculateVolume(type) {
            return this.volume.master * this.volume[type] * (this._pauseFade ? this._pauseFadeValue : 1)
        }
    }
}