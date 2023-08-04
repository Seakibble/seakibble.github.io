Player = function (x, y) {
    let obj = Obj(x, y)
    obj.player = true
    obj.size.x = 35
    obj.size.y = 60
    obj.color = "#333"
    
    obj.gravity = true
    obj.collision = true
    obj.moves = true
    obj.aimingAngle = 0
    obj.reticulePos = new Pyre.Vector()

    obj.health = 3

    obj.jumpLate = 0
    obj.dashCooldown = 0
    obj.facing = 'right'
    obj.upgrades = {
        wallClimb: true,
        dash: true,
        gun: true,
    }

    obj.damage = function (dam) {
        if (this.health) {
            this.health -= dam
            if (this.health <= 0) game.dead()
        }
    }

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

    obj.update = function () {
        if (this.gravity && !this.grounded && this.dashCooldown < 0) {
            this.vel.add(GRAVITY)
        }

        this.pos.add(this.vel)

        // 
        if (game.input.aiming) {
            this.reticulePos = getWorldSpace(game.input.mouse)
            let gun = this.getGun()
            let diff = this.reticulePos.difference(gun.pos)
            this.aimingAngle = Math.atan2(diff.y, diff.x)
        } else {
            this.aimingAngle = 0
        }
    }

    obj.checkCollision = function () {
        if (!this.collision) return

        let noGroundCollision = true
        let noWallCollision = true
        let collideLeft = false
        let collideRight = false
        for (let i = 0; i < game.objects.length; i++) {
            let that = game.objects[i]
            if (!this.moves) continue
            if (this == that) continue

            if (that.obstructs) {
                let collision = false
                let velocity = this.vel.magnitude()
                // Collide ground
                if (Collides(this.colBoxes.Down(), that)) {
                    collision = true
                    this.pos.y = that.pos.y - this.size.y

                    if (this.vel.y > 25) Sound.playSFX('landHeavy')
                    else if (this.vel.y > 5) Sound.playSFX('land')
                    // if (this.vel.y > 25) audio.player.landHeavy.play() 
                    // else if (this.vel.y > 5) audio.player.land.play()
                        
                    this.vel.y = 0
                    
                    if (this.moves) {
                        this.grounded = true
                    }
                    noGroundCollision = false
                }

                // Collide up
                if (Collides(this.colBoxes.Up(), that)) {
                    collision = true
                    this.pos.y = that.pos.y + that.size.y
                    if (this.vel.y < 0) this.vel.y = 0
                }
                // Collide left
                if (Collides(this.colBoxes.Left(), that)) {
                    collision = true
                    this.pos.x = that.pos.x + that.size.x
                    if (this.vel.x < 0) this.vel.x = 0
                    noWallCollision = false
                    collideLeft = true
                }
                // Collide right
                if (Collides(this.colBoxes.Right(), that)) {
                    collision = true
                    this.pos.x = that.pos.x - this.size.x
                    if (this.vel.x > 0) this.vel.x = 0
                    noWallCollision = false
                    collideRight = true
                }

                if (collision && that.onCollision) that.onCollision(this, velocity)
            }
        }
        if (!noWallCollision && this.upgrades.wallClimb) {
            this.sticking = true
            
            if (collideLeft) this.facing = 'right'
            else this.facing = 'left'

            if (collideLeft && game.input.left || collideRight && game.input.right) {
                this.vel.y = 0
                this.jumped = false
            }
            if (!game.input.jump) {
                game.input.jumpLock = false
                this.jumpLate = 0
            } 
        } else {
            this.sticking = false
        }

        if (noGroundCollision) {
            if (this.grounded && this.moves) {
                this.grounded = false
                this.jumpLate = 0
            } else {
                this.jumpLate++
            }
        }

        this.dashCooldown--
        if (this.dashCooldown <= DASH_RECHARGE) this.dashed = false
    }
    obj.getGun = function () {
        let pulse = Pulse(700, 2) - 2
        if (this.Facing() == 1) {
            return Box(this.pos.x + this.size.x / 2 - 5, this.pos.y + pulse + this.size.y / 2, 40, 8, GEAR_COLOR)
        } else {
            return Box(this.pos.x + this.size.x / 2 - 35, this.pos.y + pulse + this.size.y / 2, 40, 8, GEAR_COLOR)
        }
    }
    obj.draw = function () {
        // Dude
        game.camera.RenderObj(this, 3)
        let visorColor = VISOR_COLOR
        let gearColor = GEAR_COLOR
        let thrusterColor = THRUSTER_COLOR
        if (this.dashCooldown > 0) thrusterColor = 'yellow'
        else if (this.dashCooldown > DASH_RECHARGE || this.dashed) thrusterColor = '#332'

        let pulse = Pulse(700, 2) - 2

        let gun = this.getGun()
        let pivot = Pivot()
        if (game.input.aiming) {
            if (this.Facing() == 1) pivot = Pivot(4, 4, this.aimingAngle)
            else pivot = Pivot(36, 4, this.aimingAngle + Math.PI)
            
            game.camera.Render(DrawLine(
                this.reticulePos.x, this.reticulePos.y,
                this.pos.x + this.size.x / 2, this.pos.y + pulse + this.size.y / 2,
                'red'))
        }
        if (game.player.upgrades.gun) {
            game.camera.Render(DrawObj(gun, pivot), 1)
        }

        // Helmet
        game.camera.Render(Draw(this.pos.x, this.pos.y + pulse - 2, this.size.x, this.size.x-5, gearColor), 3)

        if (this.facing == 'left') {
            // Antenna
            game.camera.Render(Draw(this.pos.x + this.size.x - 7, this.pos.y - 15 + pulse, 2, 16, this.color), 4)
            
            // Visor
            game.camera.Render(Draw(this.pos.x, this.pos.y + 5 + pulse, 20, 6, visorColor), 2)
            game.camera.Render(Draw(this.pos.x, this.pos.y + 10 + pulse, 12, 10, visorColor), 2)

            if (game.player.upgrades.dash) {
                // Backpack
                game.camera.Render(Draw(this.pos.x + this.size.x - 9, this.pos.y + pulse + 20, 15, 30, gearColor), 3)
                game.camera.Render(Draw(this.pos.x + this.size.x - 2, this.pos.y + pulse + 25, 8, 20, thrusterColor), 2)
            }

            
        } else if (this.facing == 'right') {
            // Antenna
            game.camera.Render(Draw(this.pos.x + 7, this.pos.y - 15 + pulse, 2, 16, this.color), 4)

            // Visor
            game.camera.Render(Draw(this.pos.x + this.size.x - 20, this.pos.y + 5 + pulse, 20, 6, visorColor), 2)
            game.camera.Render(Draw(this.pos.x + this.size.x - 12, this.pos.y + 10 + pulse, 12, 10, visorColor), 2)

            if (game.player.upgrades.dash) {
                // Backpack
                game.camera.Render(Draw(this.pos.x - 6, this.pos.y + pulse + 20, 15, 30, gearColor), 3)
                game.camera.Render(Draw(this.pos.x - 6, this.pos.y + pulse + 25, 8, 20, thrusterColor), 2)
            }
        }

        if (game.debug) {
            game.camera.RenderObj(this.colBoxes.Up())
            game.camera.RenderObj(this.colBoxes.Down())
            game.camera.RenderObj(this.colBoxes.Left())
            game.camera.RenderObj(this.colBoxes.Right())
        }
        
    }
    Sound.loadSFXArray(['jump', 'walk', 'land', 'landHeavy', 'shoot'])
    
    game.objects.push(obj)
    return obj
}