let ctx = canvas.getContext('2d');
let CV = new Pyre.Vector()
let center = null
let Sound = new Pyre.Audio()
let Level = new Pyre.Level()

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
    objectives: [
        "Get to the OBJECTIVE",
        "Press ESC to pause",
        "A/D or arrow keys to move",
        "Spacebar to jump",
        "Shift to dash",
        "LMB to shoot gun",
        "E to interact"
    ],
    objectiveTimeouts: [],
    paused: true,
    timer: 0,
    screen: Screens(),
    initialized: false,
    over: false,
    gridX: 0,
    gridY: 0,
    winStreak: 0,
    coinsBanked: 0,
    coinsThisLevel: 0,
    world: 1,
    levelColor: 'hsl(210,35%, 40%)',
    displayObjectives: function () {
        $objectives.innerHTML = ''
        for (let i = 0; i < this.objectiveTimeouts.length; i++) {
            clearTimeout(this.objectiveTimeouts[i])
        }
        for (let i = 0; i < this.objectives.length; i++) {
            $objectives.innerHTML += `<div id="objective-${i}" class="box ${i == 0 ? 'primary' : ''}">${this.objectives[i]}</div>`
            this.objectiveTimeouts.push(setTimeout(() => {
                document.getElementById('objective-' + i).classList.add('objective')
            }, 400 * i + 1000))
        }
    },
    draw: function () {
        ctx.fillStyle = this.levelColor
        ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        // let style = "hsl(0,0%, " + pulse + "%)";
        // ctx.textAlign = "center";

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw()
        }

        // Reticule
        let cursor = getWorldSpace(this.input.mouse)
        let retThickness = 2
        let retLength = 12
        let retOffset = 8
        
        this.camera.Render(Draw(cursor.x + retOffset - 1, cursor.y - 1, retLength + 2, retThickness + 2, 'white'), 2)
        this.camera.Render(Draw(cursor.x + retOffset, cursor.y, retLength, retThickness, 'black'), 1)

        this.camera.Render(Draw(cursor.x - retOffset - retLength - 1, cursor.y -1, retLength +2, retThickness +2, 'white'), 2)
        this.camera.Render(Draw(cursor.x - retOffset - retLength, cursor.y, retLength, retThickness, 'black'), 1)
        
        this.camera.Render(Draw(cursor.x-1, cursor.y + retOffset-1, retThickness+2, retLength+2, 'white'), 2)
        this.camera.Render(Draw(cursor.x, cursor.y + retOffset, retThickness, retLength, 'black'), 1)

        this.camera.Render(Draw(cursor.x-1, cursor.y - retOffset - retLength-1, retThickness+2, retLength+2, 'white'), 2)
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
        center = new Pyre.Vector($canvas.width / 2, $canvas.height / 2);

        this.draw()
    },
    saveSettings: function () {
        localStorage.setItem('workman', game.input.workman)
        localStorage.setItem('musicEnabled', Sound.musicEnabled())
    },
    loadSettings: function () {
        let workman = localStorage.getItem('workman')
        this.input.workman = (workman === 'true')
        let musicEnabled = localStorage.getItem('musicEnabled')
        Sound.enableMusic(musicEnabled === 'true')
        
        setMusicMenuText()
        setWorkmanMenuText()
    },    
    init: function () {
        this.loadSettings()
        this.resize()
        this.screen.set('')
        this.screen.init()
        // loadAudio()

        window.addEventListener('resize', () => game.resize())
        this.start()
    },
    start: function () {
        this.world = Math.floor(this.winStreak / LEVELS_PER_WORLD)+1
        this.levelColor = 'hsl(' + ((this.world-1) * 55 + 210)%360 + ',35%, 40%)'
        $levelStart.classList.remove('start')
        this.objects = []
        this.over = false
        this.timer = 0
        this.coinsThisLevel = 0
        // Terrain
        // let x = (GRID_SCALE_X * this.winStreak % LEVELS_PER_WORLD + GRID_MINIMUM_X)
        // let y = (GRID_SCALE_Y * this.winStreak % LEVELS_PER_WORLD + GRID_MINIMUM_Y)
        // this.gridX = Math.floor(Math.random() * x) + x
        // this.gridY = Math.floor(Math.random() * y) + y
        // let gridSize = GRID_SIZE
        // let wall = 1000

        // Platform(-wall, this.gridY * gridSize, this.gridX * gridSize + wall*2, wall)// bottom
        // Platform(-wall, -wall, this.gridX * gridSize + wall*2, wall) // top

        // Platform(-wall, -wall, wall, this.gridY * gridSize + wall*2) // left
        // Platform(this.gridX * gridSize, -wall, wall, this.gridY * gridSize + wall * 2) // right
        
        // let map = []
        // for (let i = 0; i < this.gridX; i++) {
        //     let row = []
        //     for (let j = 0; j < this.gridY; j++) {
        //         row.push(null)
        //     }
        //     map.push(row)
        // }

        // let goal = 0
        // let start = this.gridY-1
        // if (Math.random() < 0.5) {
        //     goal = start
        //     start = 0
        // }
        // let randX = Math.floor(Math.random() * this.gridX)
        // map[randX][start] = 'player' 
        // if (start == 0) map[randX][1] = 'block'

        // randX = Math.floor(Math.random() * this.gridX)

        // map[randX][goal] = 'goal'
            
        // for (let i = 0; i < this.gridX; i++) {
        //     for (let j = 0; j < this.gridY; j++) {
        //         if (map[i][j] == 'player') {
        //             this.player = Player(i * gridSize + 50, j * gridSize)
        //         } else if (map[i][j] == 'goal') {
        //             Goal(i * gridSize, j * gridSize, gridSize, gridSize)
        //         } else if (map[i][j] == 'block') {
        //             Platform(i * gridSize, j * gridSize, gridSize, gridSize)
        //         } else {
        //             let rand = Math.random()
        //             if (rand > 0.95) GlassPane(i * gridSize, j * gridSize, gridSize, gridSize)
        //             else if (rand > 0.94) DamageBox(i * gridSize, j * gridSize, gridSize, gridSize)
        //             else if (rand > .8) Platform(i * gridSize, j * gridSize, gridSize, gridSize)
        //         }
        //     }
        // }        
        let levelToLoad = this.winStreak + 1
        if (levelToLoad > 3) levelToLoad = 'win'
        Level.loadLevel('level-' + levelToLoad)
            .then((player) => {
                this.player = Level.player
                this.camera.Track(this.player)
                
                // $levelStart.innerHTML = 'LEVEL ' + this.world + '-' + ((this.winStreak % LEVELS_PER_WORLD) + 1)
                $levelStart.innerHTML = Level.name
                setTimeout(() => { $levelStart.classList.add('start') }, 500)
                this.displayObjectives()

                this.startAnimating()
                this.initialized = true
                this.pause()
            })
        
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
        
        game.player.checkInteract()
        
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
            if (this.paused) this.screen.set('pause')
            else this.screen.set('')
        } else {
            if (!this.paused) this.paused = true
        }
    },
    win: function () {
        this.over = true
        this.pause()
        this.winStreak++
        game.coinsBanked += game.coinsThisLevel
        this.screen.getStats()
        this.screen.set('win')
    },
    dead: function () {
        this.over = true
        this.pause()
        this.winStreak = 0
        this.screen.set('dead')
    }
}

// Initial code when page loads
redirectToHttps()
cleanLinks()
$start.addEventListener('click', () => game.init())