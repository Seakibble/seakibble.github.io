Input = function () {
    return {
        workman: false,
        up: false,
        down: false,
        left: false,
        right: false,
        enter: false,
        jump: false,
        jumpLock: false,
        dash: false,
        dashLock: false,
        shoot: false,
        mouse: {
            x: 0,
            y: 0
        },
        reset: function () {
            this.up = false
            this.left = false
            this.right = false
            this.down = false
        },
        menuInput: function () {
            // if (this.up) $('button.selected')
            if (this.enter) {
                switch (game.screen.state) {
                    case 'win':
                        $playAgain.click()
                        break
                    case 'start':
                        $start.click()
                        break
                }
            }
            
        },
        gameInput: function () {
            // game input
            let drag = FLOOR_DRAG
            if (!game.player.grounded) drag = AIR_DRAG


            // Left and Right
            if (game.player.dashCooldown <= 0) {
                if (this.left && game.player.vel.x > -MAX_SPEED) {
                    if (game.player.vel.x > 0) game.player.vel.x *= drag
                    if (!game.player.sticking) game.player.facing = 'left'
                    game.player.vel.Add(Vector(-ACCELERATION, 0))
                } else if (this.right && game.player.vel.x < MAX_SPEED) {
                    if (game.player.vel.x < 0) game.player.vel.x *= drag
                    game.player.vel.Add(Vector(ACCELERATION, 0))
                    if (!game.player.sticking) game.player.facing = 'right'
                } else if (!this.left && !this.right) {
                    game.player.vel.x *= drag
                }
            }

            // Shooting
            if (this.shoot) {
                this.shoot = false
                console.log('shoot!')
                let facing = game.player.Facing()
                audio.player.shoot.play()
                Projectile(game.player.pos.x + game.player.size.x / 2 + facing * 10, game.player.pos.y + game.player.size.y /2, 5, 5, facing * 50, 0)
            }


            // Play walking SFX
            if (game.player.grounded && (this.left || this.right)) {
                if (!audio.player.walk.playing()) audio.player.walk.play()
            }

            // Jumping
            if (this.jump && (game.player.grounded || game.player.jumpLate < JUMP_LATE_TOLERANCE) && this.jumpLock == false) {
                if (game.player.sticking && (!game.player.grounded || (game.player.sticking && (this.left || this.right)))) {
                    if (game.player.facing == 'left') game.player.vel.x -= JUMP_POWER * WALL_JUMP_POWER
                    else game.player.vel.x += JUMP_POWER * WALL_JUMP_POWER
                }
                game.player.grounded = false
                game.player.vel.y = -JUMP_POWER

                game.player.jumped = true
                this.jumpLock = true
                audio.player.jump.play()
            }
            if (!this.jump && game.player.jumped && game.player.vel.y < 0) {
                game.player.vel.y = 0
            }
            if (game.player.grounded) {
                game.player.jumped = false
                if (!this.jump) {
                    this.jumpLock = false
                }
            }
            if (game.player.sticking || game.player.grounded) {
                game.player.dashed = false
                this.dashLock = false
            }

            // Dashing
            if (this.dash && !this.dashLock && game.player.dashCooldown <= DASH_RECHARGE) {
                this.dashLock = true
                game.player.dashed = true
                game.player.dashCooldown = DASH_DURATION
                game.player.vel.y = 0
                game.player.vel.x = DASH_POWER * game.player.Facing()
            }
            this.dash = false
        },
    }    
}

document.addEventListener("mousemove", (event) => {
    if (!game.initialized) return

    game.input.mouse.x = event.pageX
    game.input.mouse.y = event.pageY
})
document.addEventListener("mousedown", (event) => {
    if (!game.initialized) return

    let btn = 'Left Click'
    if (event.buttons == 2) btn = 'Right Click'
        
    setInput(btn, true)
})
document.addEventListener("mouseup", (event) => {
    if (!game.initialized) return

    let btn = 'Left Click'
    if (event.buttons == 2) btn = 'Right Click'

    setInput(btn, false)
})

document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    // do something
    // console.log(event.key)

    if (!game.initialized) return
    setInput(event.key, true)
})
document.addEventListener("keyup", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    if (!game.initialized) return
    setInput(event.key, false)
})

function setInput(key, keyDown) {
    if (game.input.workman) {
        // WORKMAN LAYOUT
        switch (key) {
            case 'A':
            case 'a':
            case 'ArrowLeft':
                game.input.left = keyDown
                break
            case 'ArrowRight':
            case 'H':
            case 'h':
                game.input.right = keyDown
                break
            case 'D':
            case 'd':
            case 'ArrowUp':
                game.input.up = keyDown
                break
            case 'S':
            case 's':
            case 'ArrowDown':
                game.input.down = keyDown
                break
        }
    } else {
        // QUERTY LAYOUT
        switch (key) {
            case 'A':
            case 'a':
            case 'ArrowLeft':
                game.input.left = keyDown
                break
            case 'D':
            case 'd':
            case 'ArrowRight':
                game.input.right = keyDown
                break
            case 'W':
            case 'w':
            case 'ArrowUp':
                game.input.up = keyDown
                break
            case 'S':
            case 's':
            case 'ArrowDown':
                game.input.down = keyDown
                break
        }
    }

    // Common keys
    switch (key) {
        case 'Escape':
            if (keyDown) game.pause()
            break
        case 'Shift':
            game.input.dash = keyDown
            break
        case 'F4':
            if (keyDown) game.debug = !game.debug
            break
        case ' ':
            game.input.jump = keyDown
            break
        case 'Enter':
            game.input.enter = keyDown
            break
        case 'Left Click':
            if (!keyDown) game.input.shoot = true
            break
        case 'Right Click':
            if (!keyDown) game.input.shoot = true
            break
    }
}