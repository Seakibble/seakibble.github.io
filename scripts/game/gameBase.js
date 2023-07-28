let ctx = canvas.getContext('2d');
let CV = Vector()
let center = null

let game = {
    options: {
        music: true
    },
    debug: false,
    input: Input(),
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

        ctx.font = 'bold 40px Red Hat Display';
        let pulse = Math.sin((this.now - this.startTime) / 1000) * 5 + 30
        ctx.fillStyle = "hsl(0,0%, " + pulse + "%)";
        ctx.textAlign = "center";
        ctx.fillText("Press Esc to quit...", canvas.width / 2, canvas.height / 2);
        ctx.fillText("A/D or Arrow keys to move.", canvas.width / 2, canvas.height / 2+50);
        ctx.fillText("Spacebar to jump.", canvas.width / 2, canvas.height / 2+100);


        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw()
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

        window.addEventListener('resize', () => game.resize())
        
        this.start()
    },
    start: function () {
        this.objects = []
        // Player
        this.player = Player(CV.x / 2, CV.y / 2)
        this.objects.push(this.player)

        // Goal
        this.objects.push(Goal(300, CV.y - 800, 50, 50))

        // Terrain
        this.objects.push(Platform(-100, CV.y - 100, CV.x + 200, 200))
        this.objects.push(Platform(100, CV.y - 300, 100, 100))
        this.objects.push(Platform(CV.x - 300, CV.y - 500, 200, 100))
        this.objects.push(Platform(100, CV.y - 700, 400, 30))

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