let ctx = canvas.getContext('2d');
let CV = Vector()
let center = null

let game = {
    options: {
        music: true
    },
    debug: false,
    input: Input(),
    camera: Camera(),
    player: null,
    zoom: 1,
    fpsInterval: null,
    startTime: Date.now(),
    now: null,
    then: null,
    elapsed: null,
    objects: [],
    paused: true,
    timerStart: null,
    timerElapsed: null,
    screen: Screens(),
    initialized: false,
    draw: function () {
        ctx.fillStyle = '#777'
        ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        // let style = "hsl(0,0%, " + pulse + "%)";
        // ctx.textAlign = "center";

        this.camera.Render(DrawText(500, 1300, "Get to the OBJECTIVE.", 'goldenrod'), 1)
        this.camera.Render(DrawText(500,1350, "Press Esc to quit.", 'grey'),1)
        this.camera.Render(DrawText(500, 1400, "A/D or Arrow keys to move.", 'grey'),1)
        this.camera.Render(DrawText(500, 1450, "Spacebar to jump.", 'grey'), 1)
        

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw()
        }

        // Reticule
        let cursor = getWorldSpace(this.input.mouse)
        let retThickness = 2
        let retLength = 12
        let retOffset = 8
        this.camera.Render(Draw(cursor.x + retOffset, cursor.y, retLength, retThickness, 'black'), 1)
        this.camera.Render(Draw(cursor.x - retOffset - retLength, cursor.y, retLength, retThickness, 'black'), 1)
        this.camera.Render(Draw(cursor.x, cursor.y + retOffset, retThickness, retLength, 'black'), 1)
        this.camera.Render(Draw(cursor.x, cursor.y - retOffset - retLength, retThickness, retLength, 'black'), 1)

        if (this.debug) {
            this.camera.Render(Draw(0,0,10,10,'red'))
        }
        this.camera.DrawToScreen()
        if (this.timerStart !== null && this.timerElapsed !== null) {
            let min = this.timerElapsed.getMinutes()
            if (min < 10) min = '0'+min
            let sec = this.timerElapsed.getSeconds()
            if (sec < 10) sec = '0' + sec
            let mil = this.timerElapsed.getMilliseconds()
            if (mil < 10) mil = '00' + mil
            if (mil < 100) mil = '0' + mil
            $timer.innerHTML = `<span>${min}</span>:<span>${sec}</span>`
            // $imer.innerHTML += `<span class=mil>:${mil}</span>`
        }
    },
    resize: function () {
        if ($container.offsetHeight / this.zoom < 1 || $container.offsetWidth / this.zoom < 1) {
            console.log('Too small!', zoom)
            return
        }
        CV.x = $container.offsetWidth / this.zoom
        CV.y = $container.offsetHeight / this.zoom
        $canvas.width = CV.x
        $canvas.height = CV.y
        center = Vector($canvas.width / 2, $canvas.height / 2);

        this.draw()
    },
    saveSettings: function () {
        localStorage.setItem('workman', game.input.workman)
        console.log(localStorage)
    },
    loadSettings: function () {
        let workman = localStorage.getItem('workman')
        this.input.workman = (workman === 'true')
        setWorkmanMenuText()
    },    
    init: function () {
        this.loadSettings()
        this.resize()
        this.screen.set('')
        this.screen.init()
        loadAudio()

        window.addEventListener('resize', () => game.resize())
        audio.music.play()
        this.start()
    },
    start: function () {
        this.objects = []

        // Terrain
        let gridX = 50
        let gridY = 12
        let gridSize = 100
        let wall = 1000

        Platform(-wall, gridY * gridSize, gridX * gridSize + wall*2, wall)// bottom
        Platform(-wall, -wall, gridX * gridSize + wall*2, wall) // top

        Platform(-wall, -wall, wall, gridY * gridSize + wall*2) // left
        Platform(gridX * gridSize, -wall, wall, gridY * gridSize + wall * 2) // right
        
        
        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                if (i == 0 && j == gridY - 1) {
                    // Player
                    this.player = Player(i * gridSize + 50, j * gridSize - 50)
                } else if (i == gridX - 1 && j == 0) {
                    // Goal
                    Goal(i * gridSize, j * gridSize, gridSize, gridSize)
                } else {
                    let rand = Math.random()
                    if (rand > 0.95) GlassPane(i * gridSize, j * gridSize, gridSize, gridSize)
                    else if (rand > 0.94) DamageBox(i * gridSize, j * gridSize, gridSize, gridSize)
                    else if (rand > .8) Platform(i * gridSize, j * gridSize, gridSize, gridSize)
                }
            }
        }        

        this.camera.Track(this.player)
        this.startAnimating()
        this.initialized = true
        this.timerStart = Date.now()
        this.pause()
    },
    tick: function () {
        // request another frame
        requestAnimationFrame(() => game.tick())

        // calc elapsed time since last loop
        this.now = Date.now();
        this.elapsed = this.now - this.then;

        if (this.paused) {
            this.input.menuInput()
            return
        }

        // if enough time has elapsed, draw the next frame
        if (this.elapsed > this.fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            this.then = this.now - (this.elapsed % this.fpsInterval);

            this.onFrame()
            this.cleanUp()
        }
    },
    onFrame: function () {
        this.input.gameInput()

        for (let i = 0; i < this.objects.length; i++) this.objects[i].update()
        for (let i = 0; i < this.objects.length; i++) this.objects[i].checkCollision()
        
        this.camera.Update()
        this.timerElapsed = Date.now() - this.timerStart
        this.timerElapsed = new Date(this.timerElapsed)
        this.draw()
    },
    cleanUp: function () {
        for (let i = this.objects.length - 1; i >= 0; i--) {
            if (this.objects[i].destroy) {
                this.objects[i].onDestroy()
                this.objects.splice(i, 1)
            }
        }
    },
    startAnimating: function () {
        this.fpsInterval = 1000 / FPS
        this.then = Date.now()
        this.tick()
    },
    pause: function () {
        this.paused = !this.paused
        console.log('pause: ', this.paused)
        if (this.paused) this.screen.set('pause')
        else this.screen.set('')
    },
    win: function () {
        this.pause()
        this.screen.set('win')
    },
    dead: function () {
        this.pause()
        this.screen.set('dead')
    }
}

// Initial code when page loads
redirectToHttps()
cleanLinks()
$start.addEventListener('click', () => game.init())