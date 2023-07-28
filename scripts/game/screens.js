Screens = function () {
    return {
        state: '',
        set: function (screen) {
            this.clear()
            switch (screen) {
                case '':
                    $content.style.display = 'none'
                    break
                case 'options':
                    this.state = 'options'
                    $optionsScreen.style.display = 'grid'
                    break
                case 'start':
                    this.state = 'start'
                    $startScreen.style.display = 'grid'
                    break
                case 'win':
                    this.state = 'win'
                    $victoryScreen.style.display = 'grid'
                    break
                case 'pause':
                    this.state = 'pause'
                    $pauseScreen.style.display = 'grid'
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
            $victoryScreen.style.display = 'none'
            $pauseScreen.style.display = 'none'
            $optionsScreen.style.display = 'none'
            $startScreen.style.display = 'none'
        }
    }
}