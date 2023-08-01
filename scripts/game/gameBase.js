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
    timer: 0,
    screen: Screens(),
    initialized: false,
    over: false,
    gridX: 0,
    gridY: 0,
    winStreak: 0,
    draw: function () {
        ctx.fillStyle = '#777'
        ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        // let style = "hsl(0,0%, " + pulse + "%)";
        // ctx.textAlign = "center";

        if (this.winStreak == 0) {
            this.camera.Render(DrawText(25, this.gridY * 100 + 50, "GET TO THE OBJECTIVE.", 'goldenrod'), 1)
            this.camera.Render(DrawText(50, this.gridY * 100 + 80, "Press Esc to quit.", 'grey'), 1)
            this.camera.Render(DrawText(50, this.gridY * 100 + 110, "A/D or Arrow keys to move.", 'grey'), 1)
            this.camera.Render(DrawText(50, this.gridY * 100 + 140, "Spacebar to jump.", 'grey'), 1)
            this.camera.Render(DrawText(50, this.gridY * 100 + 170, "Shift to dash.", 'grey'), 1)
            this.camera.Render(DrawText(50, this.gridY * 100 + 200, "LMB to shoot gun.", 'grey'), 1)
        }

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

        let time = this.getTime()
        $timer.innerHTML = `<span>${time[0]}</span>:<span>${time[1]}</span>`
    },
    getTime() {
        let sec = Math.floor(this.timer / FPS)
        let min = Math.floor(sec / 60)
        sec = sec % 60
        if (min < 10) min = '0' + min
        if (sec < 10) sec = '0' + sec
        // if (mil < 10) mil = '00' + mil
        // if (mil < 100) mil = '0' + mil
        
        // $imer.innerHTML += `<span class=mil>:${mil}</span>`
        return [min,sec]
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
        this.over = false
        // Terrain
        let x = (GRID_SCALE_X * this.winStreak + GRID_MINIMUM_X)
        let y = (GRID_SCALE_Y * this.winStreak + GRID_MINIMUM_Y)
        this.gridX = Math.floor(Math.random() * x) + x
        this.gridY = Math.floor(Math.random() * y) + y
        let gridSize = 100
        let wall = 1000

        Platform(-wall, this.gridY * gridSize, this.gridX * gridSize + wall*2, wall)// bottom
        Platform(-wall, -wall, this.gridX * gridSize + wall*2, wall) // top

        Platform(-wall, -wall, wall, this.gridY * gridSize + wall*2) // left
        Platform(this.gridX * gridSize, -wall, wall, this.gridY * gridSize + wall * 2) // right
        
        let world = []
        for (let i = 0; i < this.gridX; i++) {
            let row = []
            for (let j = 0; j < this.gridY; j++) {
                row.push(null)
            }
            world.push(row)
        }

        let goal = 0
        let start = this.gridY-1
        if (Math.random() < 0.5) {
            goal = start
            start = 0
        }
        let randX = Math.floor(Math.random() * this.gridX)
        world[randX][start] = 'player' 
        if (start == 0) world[randX][1] = 'block'

        randX = Math.floor(Math.random() * this.gridX)

        world[randX][goal] = 'goal'
            
        for (let i = 0; i < this.gridX; i++) {
            for (let j = 0; j < this.gridY; j++) {
                if (world[i][j] == 'player') {
                    this.player = Player(i * gridSize + 50, j * gridSize)
                } else if (world[i][j] == 'goal') {
                    Goal(i * gridSize, j * gridSize, gridSize, gridSize)
                } else if (world[i][j] == 'block') {
                    Platform(i * gridSize, j * gridSize, gridSize, gridSize)
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
        this.timer = 0
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
        this.timer++
        this.input.gameInput()

        for (let i = 0; i < this.objects.length; i++) this.objects[i].update()
        for (let i = 0; i < this.objects.length; i++) this.objects[i].checkCollision()
        
        this.camera.Update()
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
        if (!this.over) {
            this.paused = !this.paused
            console.log('pause: ', this.paused)
            if (this.paused) this.screen.set('pause')
            else this.screen.set('')
        }
    },
    win: function () {
        this.pause()
        this.winStreak++
        this.over = true
        this.screen.getStats()
        this.screen.set('win')
    },
    dead: function () {
        this.pause()
        this.over = true
        this.winStreak = 0
        this.screen.set('dead')
    }
}

// Initial code when page loads
redirectToHttps()
cleanLinks()
$start.addEventListener('click', () => game.init())