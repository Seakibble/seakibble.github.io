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
                case 'pause':
                    this.state = 'pause'
                    $pauseScreen.classList.add('active')
                    break
            }
        },
        init: function () {
            $resume.addEventListener('click', () => game.pause())
            $options.addEventListener('click', () => this.set('options'))
            $optionsBack.addEventListener('click', () => this.set('pause'))
            $keyboardLayout.addEventListener('click', () => {
                setWorkman()
                game.saveSettings()
            })
            $playAgain.addEventListener('click', () => {
                game.start()
            })  
        },
        clear: function () {
            $content.style.display = 'grid'
            $victoryScreen.classList.remove('active')
            $pauseScreen.classList.remove('active')
            $optionsScreen.classList.remove('active')
            $startScreen.classList.remove('active')
        }
    }
}