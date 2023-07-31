Screens = function () {
    return {
        state: '',
        set: function (screen) {
            this.clear()
            switch (screen) {
                case '':
                    $content.style.display = 'none'
                    $ui.classList.add('active')
                    break
                case 'options':
                    this.state = 'options'
                    $optionsScreen.classList.add('active')
                    break
                case 'start':
                    this.state = 'start'
                    $startScreen.classList.add('active')
                    $ui.classList.remove('active')
                    break
                case 'win':
                    this.state = 'win'
                    $victoryScreen.classList.add('active')
                    break
                case 'dead':
                    this.state = 'dead'
                    $deadScreen.classList.add('active')
                    break
                case 'pause':
                    this.state = 'pause'
                    $pauseScreen.classList.add('active')
                    break
            }
        },
        init: function () {
            $resume.addEventListener('click', () => game.pause())
            $options.addEventListener('click', () => this.set('options'))
            $restart.addEventListener('click', () => {
                game.start()
            })
            $optionsBack.addEventListener('click', () => this.set('pause'))
            $keyboardLayout.addEventListener('click', () => {
                setWorkman()
                game.saveSettings()
            })
            $playAgain.addEventListener('click', () => {
                game.start()
            })  
            $tryAgain.addEventListener('click', () => {
                game.start()
            })  
        },
        getStats: function () {
            let output = `<h3>MISSION DEBRIEFING</h3>`
            let time = game.getTime()
            let grade = 'F'
            let seconds = parseInt(time[0]) * 60 + parseInt(time[1])
            console.log(seconds)

            if (seconds > 80) grade = 'D'
            else if (seconds > 40) grade = 'C'
            else if (seconds > 20) grade = 'B'
            else if (seconds > 10) grade = 'A'
            else grade = 'S'

            output += `<p>Mission time: <span class='emphasis'>${time[0]}:${time[1]}</span></p>`
            output += `<p>Difficulty: <span class='emphasis'>${game.winStreak}</span></p>`
            output += `<span class='emphasis grade'>${grade}</span>`

            $stats.innerHTML = output
        },
        clear: function () {
            $content.style.display = 'grid'
            $victoryScreen.classList.remove('active')
            $pauseScreen.classList.remove('active')
            $optionsScreen.classList.remove('active')
            $startScreen.classList.remove('active')
            $deadScreen.classList.remove('active')
        }
    }
}