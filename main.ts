/**
 * Hunt the Wumpus
 * Built on
 * MakeCode Arcade JavaScript Template v. 2.2
 * Last update: 05 Jun 2019 ak
 */

/**
 * Enumerations
 */
// Standard palette
enum Color {
    Transparent, // 0
    White, // 1 = RGB(255, 255, 255)
    Red, // 2 = RGB(255, 33, 33)
    Pink, // 3 = RGB(255, 147, 196)
    Orange, // 4 = RGB(255, 129, 53)
    Yellow, // 5 = RGB(255, 246, 9)
    Aqua, // 6 = RGB(36, 156, 163)
    BrightGreen, // 7 = RGB(120, 220, 82)
    Blue, // 8 = RGB(0, 63, 173)
    LightBlue, // 9 = RGB(135, 242, 255)
    Purple, // 10 = RGB(142, 46, 196)
    RoseBouquet, // 11 = RGB(164, 131, 159)
    Wine, // 12 = RGB(92, 64, 108)
    Bone, // 13 = RGB(229, 205, 196)
    Brown, // 14 = RGB(145, 70, 61)
    Black // 15 = RGB(0, 0, 0)
}   // enum Color

// Game modes
enum GameMode {
    Attract,
    Event,
    Instructions,
    GameOver,
    Main,
    NotReady,
    Settings
}   // GameMode

/**
 * Constants
 */
const CAVE_MIN_Y: number = 10
const COLOR_BG: Color = Color.Wine
const COLOR_NAV: Color = Color.Yellow
const INSTRUCTIONS_MIN_Y: number = CAVE_MIN_Y
const INSTRUCTIONS_MAX_Y: number = 98
const SENTINEL_SHOOT: number = 99
const TEXT_GAME_OVER: string[] = [
    'A = Restart with same cave',
    'B = New game with new cave'
]
const TEXT_HAZARD_CONTINUE: string[] = ['Press A to continue']
const TEXT_HEADLINES: string[][] = [
    ['Hunt the Wumpus', 'was developed in 1973'],
    ['Originally developed', 'by Gregory Yob'],
    ['This adaptation (C) 2019', 'Robo Technical Group LLC'],
    ['Programmed in', 'MakeCode Arcade'],
    ['by', 'Alex K.']
]
const TEXT_ACTIONS: string[][] = [[
    'The classic',
    'text-based adventure!'
]]
const TEXT_INSTRUCTION_PROMPTS: string[] = [
    'A = Read More',
    'B = Start Game'
]
const TEXT_SHOOT_ERROR: string = 'Enter a number between 1 and ' + TUNNELS.length
const TEXT_SHOOT_PROMPT_BEGIN: string = 'Enter room #'
const TEXT_SHOOT_PROMPT_CANCEL: string = 'cancel'
const TEXT_SHOOT_PROMPT_DONE: string = 'done'
const TEXT_TITLES: string[] = ['Hunt the', 'Wumpus']

/**
 * Global variables
 */
let canvas: Image = image.create(screen.width, screen.height)
let gameMode: GameMode = GameMode.NotReady
let splashScreen: SplashScreens = null

/**
 * Main() a.k.a. game.onStart()
 */
startAttractMode()

/**
 * Start game modes
 */
function startAttractMode(): void {
    buildSplashScreen()
    splashScreen.build()
    gameMode = GameMode.Attract
}   // startAttractMode()

function startGame(): void {
    gameMode = GameMode.NotReady
    randomizeCave()
    updateGame()
    gameMode = GameMode.Main
}   // startGame()

function startInstructions(): void {
    gameMode = GameMode.NotReady
    // splashScreen.release()
    scene.setBackgroundImage(canvas)
    resetCanvas()
    drawInstructionPrompts()
    drawInstructions(canvas, COLOR_BG, INSTRUCTIONS_MIN_Y, INSTRUCTIONS_MAX_Y)
    gameMode = GameMode.Instructions
}   // startInstructions()

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (gameMode) {
        case GameMode.Attract:
            if (game.runtime() >= splashScreen.nextTime) {
                splashScreen.rotate()
            }   // if (game.runtime() >= splash.nextTime)
            break
    }   // switch (gameMode)
})  // game.onUpdate()

/**
 * Controller events
 */
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startInstructions()
            break

        case GameMode.GameOver:
            restartCave()
            updateGame()
            break

        case GameMode.Instructions:
            if (instructions.done) {
                startGame()
            } else {
                drawInstructions(canvas, COLOR_BG, INSTRUCTIONS_MIN_Y, INSTRUCTIONS_MAX_Y)
            }   // if (instructions.done)
            break

        case GameMode.Event:
            updateGame()
            break

        case GameMode.Main:
            shootArrow()
            break
    }   // switch (gameMode)
})  // controller.A.onEvent()

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startInstructions()
            break

        case GameMode.Event:
            // showCheat()
            break

        case GameMode.GameOver:
            startGame()
            break

        case GameMode.Instructions:
            startGame()
            break

        case GameMode.Main:
            // showCheat()
            break
    }   // switch (gameMode)
})  // controller.B.onEvent()

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startInstructions()
            break

        case GameMode.Main:
            moveDown()
            updateGame()
            break
    }   // switch (gameMode)
})  // controller.down.onEvent()

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startInstructions()
            break

        case GameMode.Main:
            moveLeft()
            updateGame()
            break
    }   // switch (gameMode)
})  // controller.left.onEvent()

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startInstructions()
            break

        case GameMode.Main:
            moveRight()
            updateGame()
            break
    }   // switch (gameMode)
})  // controller.right.onEvent()

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gameMode) {
        case GameMode.Attract:
            startInstructions()
            break
    }   // switch (gameMode)
})  // controller.up.onEvent()

/**
 * Other functions
 */
function buildSplashScreen(): void {
    RotatingScreens.canvas = canvas
    splashScreen = new SplashScreens(
        TEXT_TITLES, Color.Yellow,
        TEXT_HEADLINES, Color.Brown,
        TEXT_ACTIONS, Color.LightBlue)
}   // buildSplashScreen()

function checkForGameOver(): void {
    if (cave.gameOver) {
        drawFooter(TEXT_GAME_OVER)
        if (cave.win) {
            music.powerUp.play()
        } else {
            music.wawawawaa.play()
        }   // if (cave.win)
        gameMode = GameMode.GameOver
    } else {
        drawFooter(TEXT_HAZARD_CONTINUE)
        gameMode = GameMode.Event
    }   // if (cave.gameOver)
}   // checkForGameOver()

function clearCanvas(): void {
    canvas.fill(COLOR_BG)
}   // clearCanvas()

function drawHeader(): void {
    canvas.printCenter(TEXT_TITLES.join(' '), 0, COLOR_NAV, image.font8)
}   // drawHeader()

function drawFooter(prompts: string[]): void {
    let font: image.Font = image.font5
    let currY: number = screen.height - prompts.length * (font.charHeight + 1)
    for (let s of prompts) {
        canvas.printCenter(s, currY, COLOR_NAV, font)
        currY += font.charHeight + 1
    }   // for (s)
}   // drawFooter()

function drawInstructionPrompts(): void {
    drawFooter(TEXT_INSTRUCTION_PROMPTS)
}   // drawInstructionPrompts()

function resetCanvas(): void {
    clearCanvas()
    drawHeader()
}   // resetCanvas()

function shootArrow(): void {
    let rooms: number[] = []
    let currIndex: number = 0
    let currRoom: number = 0
    while (currIndex < MAX_ARROW_SHOT) {
        let prompt: string =
            TEXT_SHOOT_PROMPT_BEGIN + ' ' +
            (currIndex + 1) + ' (' +
            SENTINEL_SHOOT + '=' +
            (currIndex === 0 ? TEXT_SHOOT_PROMPT_CANCEL : TEXT_SHOOT_PROMPT_DONE) +
            ')'
        // currRoom = parseInt(game.askForString(prompt, 2))
        // Coming soon!
        // https://github.com/microsoft/pxt-common-packages/pull/730
        // https://arcade.makecode.com/21785-23748-99493-78382
        currRoom = game.askForNumber(prompt, 2)
        if (currRoom === SENTINEL_SHOOT) {
            break
        }   // if (currRoom === sentinel)
        if (currRoom > 0 && currRoom <= TUNNELS.length) {
            rooms.push(currRoom)
            currIndex++
        } else {
            game.splash(TEXT_SHOOT_ERROR)
        }   // if (! currRoom)
    }   // while (currIndex ...)
    if (rooms.length > 0) {
        resetCanvas()
        shoot(rooms, canvas, CAVE_MIN_Y)
        checkForGameOver()
    }   // if (rooms)
}   // shootArrow()

function updateGame(): void {
    gameMode = GameMode.NotReady
    resetCanvas()
    if (drawCave(canvas, CAVE_MIN_Y)) {
        checkForGameOver()
    } else {
        gameMode = GameMode.Main
    }   // if (drawCave)
}   // updateGame