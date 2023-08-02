// UI
const UI_COLOR_PRIMARY = 'rgb(0, 16, 42)'
const UI_COLOR_SECONDARY = 'rgb(68, 214, 255)'
const UI_COLOR_TERTIARY = '#ccffff'
document.body.style.setProperty('--primary', UI_COLOR_PRIMARY)
document.body.style.setProperty('--secondary', UI_COLOR_SECONDARY)
document.body.style.setProperty('--tertiary', UI_COLOR_TERTIARY)

// General
const FPS = 60
const GRAVITY = Vector(0, 0.5)
const CAMERA_LAG = 0.08
const CAMERA_BOUNDARY = 200

// World
const GRID_MINIMUM_X = 8
const GRID_MINIMUM_Y = 5
const GRID_SCALE_X = 4
const GRID_SCALE_Y = 1
const GRID_SIZE = 100

// Audio
const MUSIC = [
    "01-galactic-agent",
    "02-clearly-the-bad-guys",
    "03-mildly-intoxicating"
]


// Player
const JUMP_LATE_TOLERANCE = 0.1 * FPS
const JUMP_POWER = 15
const WALL_JUMP_POWER = 0.5
const DASH_POWER = 15
const DASH_RECHARGE = -0.7 * FPS
const DASH_DURATION = 0.3 * FPS
const AIR_DRAG = 0.96
const FLOOR_DRAG = 0.7
const MAX_SPEED = 7
const ACCELERATION = 0.8

const VISOR_COLOR = 'limegreen'
const GEAR_COLOR = '#ccc'
const THRUSTER_COLOR = 'olive'