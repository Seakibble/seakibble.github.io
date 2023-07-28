let $canvas = document.getElementById('canvas')
let $container = document.getElementById('container')
let $content = document.getElementById('content')

let $pauseMenu = document.getElementById('pauseMenu')
let $resume = document.getElementById('resume')
let $options = document.getElementById('options')

let $optionsMenu = document.getElementById('optionsMenu')
let $keyboardLayout = document.getElementById('keyboardLayout')
let $optionsBack = document.getElementById('optionsBack')

let $startMenu = document.getElementById('startMenu')
let $start = document.getElementById('start')

let ctx = canvas.getContext('2d');
let CV = Vector()

// const max_oh_no = new Image(60, 60)
// max_oh_no.src = '/images/max_moon.png'
// ctx.drawImage(max_oh_no, 100, 100, 480, 480)

// ctx.fillStyle = 'white';
// ctx.fillRect(10, 10, 10, 10);


// ctx.beginPath();
// ctx.translate(50, 50);
// ctx.arc(0, 0, 25, 0, 2 * Math.PI);
// ctx.fillStyle = "rgb(250, 230, 0)";
// ctx.fill();
// ctx.resetTransform()

let game = {
    options: {
        music: true
    },
    debug: false,
    input: Input(),
    player: null,
    zoom: 1,
    fpsInterval: null,
    start: Date.now(),
    now: null,
    then: null,
    elapsed: null,
    objects: [],
    paused: true,
    menuState: '',
    initialized: false,
    draw: function () {
        ctx.fillStyle = 'grey'
        ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        // ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.font = 'bold 80px Red Hat Display';
        let pulse = Math.sin((this.now - this.start) / 500) * 10 + 30
        ctx.fillStyle = "hsl(0,0%, "+pulse+"%)";
        ctx.textAlign = "center";
        ctx.fillText("Press Esc to quit...", canvas.width / 2, canvas.height / 2);


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
        // center = Vector($canvas.width / 2, $canvas.height / 2);

        this.draw()
    },
    applyInput: function () {
        if (this.input.left && this.player.vel.x > -this.player.maxSpeed) {
            if (this.player.vel.x > 0) this.player.vel.x = 0
            this.player.vel.Add(Vector(-this.player.acceleration, 0))
        } else if (this.input.right && this.player.vel.x < this.player.maxSpeed) {
            if (this.player.vel.x < 0) this.player.vel.x = 0
            this.player.vel.Add(Vector(this.player.acceleration, 0))
        } else if (!this.input.left && !this.input.right) {
            this.player.vel.x = 0
        }

        if (this.input.jump && this.player.grounded && this.input.jumpLock == false) {
            this.player.grounded = false
            this.player.vel.y = -this.player.jumpPower
            this.player.jumped = true
            this.input.jumpLock = true
        }
        if (!this.input.jump && this.player.jumped && this.player.vel.y < 0) {
            this.player.vel.y = 0
        }
        if (this.player.grounded) {
            this.player.jumped = false
            if (!this.input.jump) {
                this.input.jumpLock = false
            }
        }

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
        // document.body.requestFullscreen()
        this.loadSettings()

        // Set the canvas size, and add the listener so it resizes properly later
        this.resize()
        $startMenu.style.display = 'none'
        $pauseMenu.style.display = 'grid'

        window.addEventListener('resize', () => game.resize())
        $resume.addEventListener('click', () => game.pause())
        $options.addEventListener('click', () => game.optionsMenu())
        $optionsBack.addEventListener('click', () => game.optionsMenu())
        $keyboardLayout.addEventListener('click', () => {
            setWorkman()
            this.saveSettings()
        })

        // ctx.globalCompositeOperation = 'source-over';

        // let speed = 5
        // for (let i = 0; i < 50; i++) {
        //     this.objects.push(Obj(Math.random() * CV.x, Math.random() * CV.y))
        //     this.objects[i].vel.x = Math.random() * speed - (speed/2)
        //     this.objects[i].vel.y = Math.random() * speed - (speed / 2)
        // }

        this.player = Player(CV.x / 2, CV.y / 2)
        this.objects.push(this.player)

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
        this.applyInput()

        for (let i = 0; i < this.objects.length; i++) {
            // console.log(this.objects[i], i)
            this.objects[i].update()
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].checkCollision()
        }
        // Put your drawing code here
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
        if (this.paused) {
            $content.style.display = 'grid'
        } else {
            $content.style.display = 'none'
            if (this.menuState == 'options') this.optionsMenu()
        }
    },
    optionsMenu: function () {
        if (this.menuState == 'options') {
            this.menuState = ''
            $pauseMenu.style.display = 'grid'
            $optionsMenu.style.display = 'none'
        } else {
            this.menuState = 'options'
            $pauseMenu.style.display = 'none'
            $optionsMenu.style.display = 'grid'
        }
    }
}


redirectToHttps()
cleanLinks()
$start.addEventListener('click', () => game.init())