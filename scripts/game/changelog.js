const CHANGELOG = [
    // { version: '', log: '' },
    { version: 'v0.9.0', log: 'Levels load from CSVs, refactored with Pyre Level' },
    { version: 'v0.8.4', log: 'Added Pyre Level class' },
    { version: 'v0.8.3', log: 'Refactored Audio with Pyre Audio' },
    { version: 'v0.8.2', log: 'Added Pyre Audio class' },
    { version: 'v0.8.1', log: 'Refactored Vector with Pyre Vector' },
    { version: 'v0.8.0', log: 'Added Pyre Vector class' },
    { version: 'v0.7.10', log: 'There are now worlds with 5 levels each' },
    { version: 'v0.7.9', log: 'Toggling music actually does something now' },
    { version: 'v0.7.8', log: 'More music, unique colours for levels' },
    { version: 'v0.7.7', log: 'Camera constraint bug fixes' },
    { version: 'v0.7.6', log: 'Camera constrained to level, pausing quiets music' },
    { version: 'v0.7.5', log: 'Added objectives and level indicator' },
    { version: 'v0.7.4', log: "Glass doesn't vanish when broken, high-vis reticule" },
    { version: 'v0.7.3', log: 'Improved start screen gradient' },
    { version: 'v0.7.2', log: 'Randomised player/goal spawns, no more death spawns' },
    { version: 'v0.7.1', log: 'Movement tweaks for more deliberate play, updated help text' },
    { version: 'v0.7.0', log: 'Added mission grading, scaling levels with more variance' },
    { version: 'v0.6.5', log: 'Timer fix, style overhaul, new font' },
    { version: 'v0.6.4', log: 'In-game timer now pauses correctly' },
    { version: 'v0.6.3', log: 'Added killboxes' },
    { version: 'v0.6.2', log: 'Added a targeting reticule' },
    { version: 'v0.6.1', log: 'Added aiming, UI no longer selectable' },
    { version: 'v0.6.0', log: 'Added a gun =D' },
    { version: 'v0.5.8', log: 'Added glass blocks' },
    { version: 'v0.5.7', log: 'Made music louder' },
    { version: 'v0.5.6', log: 'Tweaks to constants, costume change' },
    { version: 'v0.5.5', log: 'No dash queueing (again), no floor dash spam' },
    { version: 'v0.5.4', log: 'No more dash queueing' },
    { version: 'v0.5.3', log: 'Added restart in case the seed is fucked' },
    { version: 'v0.5.2', log: 'Jump now also antigrav-pack' },
    { version: 'v0.5.1', log: 'Added rudimentary dash upgrade' },
    { version: 'v0.5.0', log: 'Added music and sfx, larger levels with smaller grid' },
    { version: 'v0.4.5', log: 'UI is hidden on win and start menus' },
    { version: 'v0.4.4', log: 'Added some visual flare and an objective' },
    { version: 'v0.4.3', log: 'Added half-baked timer, more constants' },
    { version: 'v0.4.2', log: 'Added sick wall slides, player less sticky' },
    { version: 'v0.4.1', log: 'Collision bugfix, added priority system to renderer' },
    { version: 'v0.4.0', log: 'Random levels, camera tracking' },
    { version: 'v0.3.1', log: 'Screens now use CSS classes' },
    { version: 'v0.3.0', log: 'Added drag, player facing, wall jumping/sticking' },
    { version: 'v0.2.0', log: 'Refactored gameBase, added screens.js and refrences.js' },
    { version: 'v0.1.0', log: 'Refactored screen switching, new version format' },
    { version: 'v0.09', log: 'Added goal, victory screen, game loop' },
    { version: 'v0.08', log: 'Added tolerance for delayed jumps' },
    { version: 'v0.07', log: 'Added debug mode (F4 to toggle), cleaned up input.js' },
    { version: 'v0.06', log: 'Player now collides with walls' },
    { version: 'v0.05', log: 'Player now collides with ceilings' },
    { version: 'v0.04', log: 'Refined player collision, added changelog' },
    { version: 'v0.03', log: 'Added workman/qwerty keyboard layout option' },
    { version: 'v0.02', log: "Added jump lock (so you can only jump once), tweaks to demo level" },
    { version: 'v0.01', log: 'Added version indicator' },
    { version: 'v0.00', log: 'Initial commit, basic platforming' },
]

const VERSION = CHANGELOG[0].version


$version.textContent = "CHANGELOG | "+VERSION
$version.addEventListener('click', () => {
    console.log('%cCHANGELOG', "font-weight: bold; color: lime")

    let bold = "font-weight: bold; color: crimson"
    let normal = "font-weight: normal; color: white"

    for (let i = 0; i < CHANGELOG.length; i++) {
        console.log("%c" + CHANGELOG[i].version + "\n%c" + CHANGELOG[i].log, bold, normal)
    }
    alert("Changelog in the inspector (hit F12 and go to the console).")
})