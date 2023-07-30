let audio = {
    music: null,
    player: {
        jump: null,
        walk: null,
        land: null,
        landHeavy: null
    }
}

function loadAudio() {
     audio.music = new Howl({
        src: ['scripts/game/audio/music/01-galactic-agent.mp3'],
        loop: true,
        volume: 0.2
    })

    audio.player.jump = new Howl({
        src: ['scripts/game/audio/sfx/jump.mp3']
    })
    audio.player.land = new Howl({
        src: ['scripts/game/audio/sfx/land.mp3']
    })
    audio.player.landHeavy = new Howl({
        src: ['scripts/game/audio/sfx/landHeavy.mp3']
    })
    audio.player.walk = new Howl({
        src: ['scripts/game/audio/sfx/walk.mp3']
    })
}