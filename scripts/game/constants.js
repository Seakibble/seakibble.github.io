// General
const UI_COLOR_PRIMARY = 'rgb(0, 16, 42)'
const UI_COLOR_SECONDARY = 'rgb(68, 214, 255)'
document.body.style.setProperty('--primary', UI_COLOR_PRIMARY)
document.body.style.setProperty('--secondary', UI_COLOR_SECONDARY)

const FPS = 60
const GRAVITY = Vector(0, 0.5)

const CAMERA_LAG = 0.08

// Player
const JUMP_LATE_TOLERANCE = 0.1 * FPS
const JUMP_POWER = 15
const WALL_JUMP_POWER = 0.65
const DASH_POWER = 15
const DASH_RECHARGE = -0.7 * FPS
const DASH_DURATION = 0.3 * FPS
const AIR_DRAG = 0.96
const FLOOR_DRAG = 0.7
const MAX_SPEED = 10
const ACCELERATION = 1

const VISOR_COLOR = 'limegreen'
const GEAR_COLOR = '#ccc'
const THRUSTER_COLOR = 'olive'