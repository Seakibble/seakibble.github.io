Input = function () {
    return {
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

function setInput(key, value) {
    switch (key) {
        case 'Escape':
            if (value) game.pause()
            break
        case 'ArrowLeft':
            game.input.left = value
            break
        case 'ArrowRight':
            game.input.right = value
            break
        case 'ArrowUp':
            game.input.up = value
            break
        case 'ArrowDown':
            game.input.down = value
            break
        case ' ':
            game.input.jump = value
            break
    }
}