Input = function () {
    return {
        workman: false,
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
        jumpLock: false,
        reset: function () {
            this.up = false
            this.left = false
            this.right = false
            this.down = false
        }
    }
}


document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    // do something
    console.log(event.key)

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
        case 'F4':
            if (keyDown) game.debug = !game.debug
            break
        case ' ':
            game.input.jump = keyDown
            break
    }
}