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
    screen: Screens(),
    initialized: false,
    draw: function () {
        ctx.fillStyle = 'grey'
        ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        let pulse = Math.sin((this.now - this.startTime) / 1000) * 5 + 30
        let style = "hsl(0,0%, " + pulse + "%)";
        // ctx.textAlign = "center";

        game.camera.Render(DrawText(500,500, "Press Esc to quit...", style),1)
        game.camera.Render(DrawText(500, 550, "A/D or Arrow keys to move.", style),1)
        game.camera.Render(DrawText(500, 600, "Spacebar to jump.", style),1)
        


        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw()
        }

        if (this.debug) {
            this.camera.Render(Draw(0,0,10,10,'red'))
        }
        this.camera.DrawToScreen()
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

        window.addEventListener('resize', () => game.resize())
        
        this.start()
    },
    start: function () {
        this.objects = []

        // Terrain
        let gridX = 20
        let gridY = 10
        let gridSize = 120
        let wall = 1000

        this.objects.push(Platform(-wall, gridY * gridSize, gridX * gridSize + wall*2, wall))// bottom
        this.objects.push(Platform(-wall, -wall, gridX * gridSize + wall*2, wall)) // top

        this.objects.push(Platform(-wall, -wall, wall, gridY * gridSize + wall*2)) // left
        this.objects.push(Platform(gridX * gridSize, -wall, wall, gridY * gridSize + wall * 2)) // right
        
        
        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                if (i == 0 && j == gridY - 1) {
                    // Player
                    this.player = Player(i * gridSize+50, j * gridSize - 50)
                    this.objects.push(this.player)
                } else if (i == gridX-1 && j == 0) {
                    // Goal
                    this.objects.push(Goal(i * gridSize, j * gridSize, gridSize, gridSize))
                } else if (Math.random() > 0.85) {
                    this.objects.push(Platform(i * gridSize, j * gridSize, gridSize, gridSize))
                }
            }
        }        

        this.camera.Track(this.player)
        this.startAnimating()
        this.initialized = true
        this.pause()
    },
    tick: function () {
        // request another frame
        requestAnimationFrame(() => game.tick())

        // calc elapsed time since last loop
        this.now = Date.now();
        this.elapsed = this.now - this.then;

        if (this.paused) {
            console.log('paused')
            return
        }

        // if enough time has elapsed, draw the next frame
        if (this.elapsed > this.fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            this.then = this.now - (this.elapsed % this.fpsInterval);

            this.onFrame()
        }
    },
    onFrame: function () {
        this.input.applyInput()

        for (let i = 0; i < this.objects.length; i++) this.objects[i].update()
        for (let i = 0; i < this.objects.length; i++) this.objects[i].checkCollision()
        
        this.camera.Update()
        this.draw()
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
    }
}

// Initial code when page loads
redirectToHttps()
cleanLinks()
$start.addEventListener('click', () => game.init())