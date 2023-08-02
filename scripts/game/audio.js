let audio = {
    music: null,
    player: {
        jump: null,
        walk: null,
        land: null,
        landHeavy: null,
        shoot: null
    },
    glassBreak: null
}

function loadAudio() {
    loadMusic()
    
    if (audio.player.jump == null) audio.player.jump = new Howl({
        src: ['scripts/game/audio/sfx/jump.mp3'],
        html5: true
    })
    if (audio.player.land == null) audio.player.land = new Howl({
        src: ['scripts/game/audio/sfx/land.mp3'],
        html5: true
    })
    if (audio.player.landHeavy == null) audio.player.landHeavy = new Howl({
        src: ['scripts/game/audio/sfx/landHeavy.mp3'],
        html5: true
    })
    if (audio.player.walk == null) audio.player.walk = new Howl({
        src: ['scripts/game/audio/sfx/walk.mp3'],
        html5: true
    })
    if (audio.player.shoot == null) audio.player.shoot = new Howl({
        src: ['scripts/game/audio/sfx/shoot.mp3'],
        html5: true
    })

    audio.glassBreak = new Howl({
        src: ['scripts/game/audio/sfx/glassBreak.mp3'],
        volume: 0.7,
        html5: true
    })    
}

function loadMusic() {
    let track = Math.floor(Math.random() * MUSIC.length)
    audio.music = new Howl({
        src: ['scripts/game/audio/music/' + MUSIC[track] + '.mp3'],
        loop: true,
        volume: 0.4,
        html5: true
    })
}