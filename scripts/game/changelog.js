const CHANGELOG = [
    { version: 'v0.05', log: 'Player now collides with ceilings' },
    { version: 'v0.04', log: 'Refined player collision, added changelog' },
    { version: 'v0.03', log: 'Added workman/qwerty keyboard layout option' },
    { version: 'v0.02', log: "Added jump lock (so you can only jump once), tweaks to demo level" },
    { version: 'v0.01', log: 'Added version indicator' },
    { version: 'v0.00', log: 'Initial commit, basic platforming' },
]

const VERSION = CHANGELOG[0].version
document.getElementById('version').textContent = "CHANGELOG | "+VERSION
document.getElementById('version').addEventListener('click', () => {
    console.log('%cCHANGELOG', "font-weight: bold; color: lime")

    let bold = "font-weight: bold; color: crimson"
    let normal = "font-weight: normal; color: white"

    for (let i = 0; i < CHANGELOG.length; i++) {
        console.log("%c" + CHANGELOG[i].version + "\n%c" + CHANGELOG[i].log, bold, normal)
    }
    alert("Changelog in the inspector (hit F12 and go to the console).")
})