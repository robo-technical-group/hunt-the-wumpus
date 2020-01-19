/**
 * Enumerations
 */
enum Hazard {
    None,
    Bats,
    Pit,
    Wumpus
}   // enum Hazards

/**
 * Interfaces
 */
interface Cave {
    arrows: number
    currRoom: number
    gameOver: boolean
    randomized: number[]
    rooms: Room[]
    start: number
    win: boolean
    wumpus: number
    wumpusStart: number
}   // interface Cave

interface InstructionsStatus {
    currCharacter: number
    currString: number
    done: boolean
}   // interface InstructionsStatus

interface Pixel {
    x: number
    y: number
}   // interface Pixel

interface Room {
    id: number
    links: number[]
    hazard: Hazard
}   // Room

/**
 * Constants
 */
const CHANCE_WUMPUS_STAYS: number = 25
const COLOR_INSTRUCTIONS_TEXT: number = 1 // White
const COLOR_DIRECTION_TEXT: number = 5 // Yellow
const COLOR_CAVE_TEXT: number = 1 // White
const MAX_ARROW_SHOT: number = 5
const NUM_ARROWS: number = 5
const NUM_PITS: number = 2
const NUM_SUPERBATS: number = 2
const TEXT_ARROW_EMPTY: string = 'Oh no! Your quiver is empty!'
const TEXT_ARROW_END: string = 'Ouch! Arrow got you!'
const TEXT_ARROW_MISS: string = 'Oops! Missed!'
const TEXT_ARROW_PATH_ACTUAL: string = 'Actual Path'
const TEXT_ARROW_PATH_REQUESTED: string = 'Requested path'
const TEXT_ARROW_SHOT: string = 'You fired an arrow from room'
const TEXT_BATS: string = 'Bats'
const TEXT_BATS_FOUND: string = 'ZAP---Super bat snatch!\nElsewhereville for you!'
const TEXT_BATS_WARN: string = 'Bats nearby'
const TEXT_DOWN: string = 'Down ='
const TEXT_LEFT: string = 'L='
const TEXT_PIT: string = 'Pit'
const TEXT_PIT_FOUND: string = 'YYYIIIIEEEE . . . Fell in a pit!'
const TEXT_PIT_WARN: string = 'I feel a draft'
const TEXT_RIGHT: string = 'R='
const TEXT_SHOOT: string = 'A = Shoot'
const TEXT_WUMPUS: string = 'Wumpus'
const TEXT_WUMPUS_END_BAD: string = 'Tsk tsk tsk - Wumpus got you!'
const TEXT_WUMPUS_END_GOOD: string = "Aha! You got the wumpus! The wumpus'll get you next time!"
const TEXT_WUMPUS_FOUND: string = '... Oops! Bumped a wumpus!'
const TEXT_WUMPUS_MOVE: string = 'The wumpus is on the move....'
const TEXT_WUMPUS_WARN: string = 'I smell a wumpus'

// id, left, right, down
const TUNNELS: number[][] = [
    [1, 5, 2, 8],
    [2, 1, 3, 10],
    [3, 2, 4, 12],
    [4, 3, 5, 14],
    [5, 4, 1, 6],
    [6, 15, 7, 5],
    [7, 6, 8, 17],
    [8, 7, 9, 1],
    [9, 8, 10, 18],
    [10, 9, 11, 2],
    [11, 10, 12, 19],
    [12, 11, 13, 3],
    [13, 12, 14, 20],
    [14, 13, 15, 4],
    [15, 14, 6, 16],
    [16, 20, 17, 15],
    [17, 16, 18, 7],
    [18, 17, 19, 9],
    [19, 18, 20, 11],
    [20, 19, 16, 13]
]

const TEXT_INSTRUCTIONS: string[] = [
    'Welcome to\nHunt the Wumpus!',

    "The wumpus lives in a cave of " + TUNNELS.length + " rooms. Each room has " + (TUNNELS[0].length - 1) +
    " tunnels leading to other rooms.\n \n" +
    "(Look at a dodecahedron to see how this works. " +
    "If you don't know what a dodecahedron is, ask someone.)",

    'Bottomless Pits - ' + NUM_PITS +
    ' rooms have bottomless pits in them. If you go there, you fall into the pit & lose!',

    'Superbats - ' + NUM_SUPERBATS + ' other rooms have super bats. ' +
    'If you go there, a bat grabs you and takes you to some other room at random (which might be troublesome).',

    'The wumpus is not bothered by the hazards. (He has sucker feet and is too big for a bat to lift.)\n' +
    'Usually, he is asleep. Two things that wake him up: Your entering his room or your shooting an arrow.',
    'If the wumpus wakes, he moves (P=' + (100 - CHANCE_WUMPUS_STAYS) + '%) one room or stays still (P=' + CHANCE_WUMPUS_STAYS +
    '%). After that, if he is where you are, he eats you up & you lose!',

    'Each turn you may move or shoot a crooked arrow.',

    'Moving: Use left, right, or down to move to an adjacent room (through a tunnel).',

    "Arrows: Press A to shoot. You have " + NUM_ARROWS + " arrows. You lose when you run out. Each arrow can go from 1 to " +
    MAX_ARROW_SHOT + " rooms. You aim by telling the computer the rooms you want to arrow to go to. " +
    "If the arrow can't go that way, it moves at random to the next room. " +
    "If the arrow hits the wumpus, you win. If the arrow hits you, you lose.",

    'Warnings: When you are one room away from the wumpus or a hazard, the computer says ' +
    '"' + TEXT_WUMPUS_WARN + '," "' + TEXT_BATS_WARN + '," or "' + TEXT_PIT_WARN + '."'
]

/**
 * Global variables
 */
let cave: Cave = {
    arrows: -1,
    currRoom: -1,
    gameOver: false,
    randomized: [],
    rooms: [],
    start: -1,
    win: false,
    wumpus: -1,
    wumpusStart: -1
}
let instructions: InstructionsStatus = {
    currCharacter: 0,
    currString: 0,
    done: false
}

/**
 * Functions
 */
function drawBats(img: Image, beginY: number): void {
    drawHazard(TEXT_BATS, TEXT_BATS_FOUND, img, beginY)
}   // drawBats()

function drawCave(img: Image, beginY: number): boolean {
    let fi: FontInfo = drawStrings.createFontInfo(FontName.Font8)
    let room: Room = cave.rooms[cave.currRoom]
    if (room.hazard !== Hazard.None) {
        switch (room.hazard) {
            case Hazard.Bats:
                drawBats(img, beginY)
                cave.currRoom = Math.randomRange(TUNNELS[0][0], TUNNELS.length - 1 + TUNNELS[0][0])
                break

            case Hazard.Pit:
                drawPit(img, beginY)
                cave.gameOver = true
                cave.win = false
                break

            case Hazard.Wumpus:
                drawWumpus(img, beginY)
                moveWumpus()
                if (cave.currRoom === cave.wumpus) {
                    drawStrings.writeWrapped(TEXT_WUMPUS_END_BAD, img,
                        0, 80, 0, screen.height, TextAlignment.Center,
                        COLOR_CAVE_TEXT, fi)
                    cave.gameOver = true
                    cave.win = false
                }   // if (cave.currRoom === cave.wumpus)
                break
        }   // switch (room.hazard)
        return true
    }   // if (room.hazard)
    fi = drawStrings.createFontInfo(FontName.Font5)
    drawStrings.writeWrapped(TEXT_LEFT + ' ' + room.links[0], img,
        2, 55, 15, 75, TextAlignment.Left, COLOR_DIRECTION_TEXT, fi, 0, 2)
    drawStrings.writeWrapped(TEXT_RIGHT + ' ' + room.links[1], img,
        145, 55, 159, 75, TextAlignment.Left, COLOR_DIRECTION_TEXT, fi, 0, 2)
    drawStrings.writeWrapped(TEXT_DOWN + ' ' + room.links[2], img,
        0, screen.height - fi.font.charHeight - 1, 159, screen.height,
        TextAlignment.Center, COLOR_DIRECTION_TEXT, fi)
    drawStrings.writeWrapped(TEXT_SHOOT, img,
        0, beginY, 159, beginY + 10, TextAlignment.Center, COLOR_DIRECTION_TEXT, fi)
    let roomText = ''
    // let exitFor: boolean = false
    for (let hazard: Hazard = Hazard.Bats; hazard <= Hazard.Wumpus; hazard++) {
        for (let link: number = 0; link < room.links.length; link++) {
            if (cave.rooms[room.links[link]].hazard === hazard) {
                switch (hazard) {
                    case Hazard.Bats:
                        roomText += TEXT_BATS_WARN + '!\n'
                        break

                    case Hazard.Pit:
                        roomText += TEXT_PIT_WARN + '!\n'
                        break

                    case Hazard.Wumpus:
                        roomText += TEXT_WUMPUS_WARN + '!\n'
                        break
                }   // switch (hazard)
                // exitFor = true
                break
            }   // if (cave.rooms[room.links[link]].hazard ...)

            // The wumpus may be in a room with another hazard
            if (hazard === Hazard.Wumpus && room.links[link] === cave.wumpus) {
                roomText += TEXT_WUMPUS_WARN + '!\n'
                // exitFor = true
                break
            }   // if (hazard === Hazard.Wumpus...)
        }   // for (link)
        /*
        if (exitFor) {
            exitFor = false
            continue
        }   // if (exitFor)
        */
    }   // for (hazard)
    roomText += 'You are in room ' + cave.currRoom + '\n'
    roomText += 'Tunnels lead to rooms'
    for (let link: number = 0; link < room.links.length; link++) {
        roomText += ' ' + room.links[link]
    }   // for (link)
    roomText += '\nWhat is your next move?'
    fi = drawStrings.createFontInfo(FontName.Font8)
    drawStrings.writeWrapped(roomText, img,
        20, beginY + 10, 139, screen.height, TextAlignment.Left, COLOR_CAVE_TEXT, fi)
    return false
}   // drawCave()

function drawHazard(header: string, body: string, img: Image, beginY: number) {
    let fi: FontInfo = drawStrings.createFontInfo(FontName.Font8, 2)
    drawStrings.writeWrapped(header + '!', img, 0, beginY, screen.width, screen.height,
        TextAlignment.Center, COLOR_CAVE_TEXT, fi, 0)
    fi = drawStrings.createFontInfo(FontName.Font8)
    drawStrings.writeWrapped(body, img, 0, beginY + 40, screen.width, screen.height,
        TextAlignment.Center, COLOR_CAVE_TEXT, fi, 0)
}   // drawHazard()

function drawInstructions(img: Image, bgColor: number, beginY: number, maxY: number): void {
    img.fillRect(0, beginY, img.width, maxY, bgColor)
    let fi: FontInfo = drawStrings.createFontInfo(FontName.Font8)
    instructions.currCharacter = drawStrings.writeWrapped(
        TEXT_INSTRUCTIONS[instructions.currString], img,
        0, beginY, screen.width - 1, maxY, TextAlignment.Left, COLOR_INSTRUCTIONS_TEXT, fi,
        instructions.currCharacter)
    if (instructions.currCharacter === -1) {
        instructions.currCharacter = 0
        instructions.currString++
        if (instructions.currString >= TEXT_INSTRUCTIONS.length) {
            instructions.done = true
        }   // if (instructions.currString >= INSTRUCTIONS.length)
    }   // if (! instructions.currCharacter)
}   // drawInstructions()

function drawPit(img: Image, beginY: number): void {
    drawHazard(TEXT_PIT, TEXT_PIT_FOUND, img, beginY)
}   // drawBats()

function drawWumpus(img: Image, beginY: number): void {
    drawHazard(TEXT_WUMPUS, TEXT_WUMPUS_FOUND + '\n \n' + TEXT_WUMPUS_MOVE,
        img, beginY)
}   // drawBats()

function initCave(): void {
    for (let tunnel of TUNNELS) {
        let room: Room = {
            id: tunnel[0],
            links: [],
            hazard: Hazard.None
        }
        for (let index = 1; index < tunnel.length; index++) {
            room.links.push(tunnel[index])
        }   // for (index)
        cave.rooms[room.id] = room
    }   // for (tunnel)
}   // initCave()

function move(link: number): void {
    cave.currRoom = cave.rooms[cave.currRoom].links[link]
}   // move()

function moveDown(): void {
    move(2)
}   // moveDown()

function moveLeft(): void {
    move(0)
}   // moveLeft()

function moveRight(): void {
    move(1)
}   // moveRight()

function moveWumpus(): void {
    if (Math.percentChance(100 - CHANCE_WUMPUS_STAYS)) {
        if (cave.rooms[cave.wumpus].hazard === Hazard.Wumpus) {
            cave.rooms[cave.wumpus].hazard = Hazard.None
        }   // if (cave.rooms[cave.wumpus].hazard === Hazard.Wumpus)
        cave.wumpus = Math.pickRandom(cave.rooms[cave.wumpus].links)
        if (cave.rooms[cave.wumpus].hazard === Hazard.None) {
            cave.rooms[cave.wumpus].hazard = Hazard.Wumpus
        }   // if (! cave.rooms[cave.wumpus].hazard)
    }   // if (Math.percentChance(CHANCE_WUMPUS_STAYS))
}   // moveWumpus()

function randomizeCave(): void {
    if (cave.rooms.length === 0) {
        initCave()
    }   // if (! cave.rooms)

    let randomRooms: number[] = []
    for (let index: number = TUNNELS[0][0]; index <= TUNNELS.length - 1 + TUNNELS[0][0]; index++) {
        randomRooms.push(index)
    }   // for (index)
    shuffle(randomRooms)
    let currIndex: number = 0
    for (let index: number = 0; index < NUM_PITS; index++) {
        cave.rooms[randomRooms[currIndex]].hazard = Hazard.Pit
        currIndex++
    }   // for (index)
    for (let index: number = 0; index < NUM_SUPERBATS; index++) {
        cave.rooms[randomRooms[currIndex]].hazard = Hazard.Bats
        currIndex++
    }   // for (index)
    cave.wumpusStart = randomRooms[currIndex]
    cave.start = randomRooms[currIndex + 1]
    cave.randomized = randomRooms
    // showCheat()
    restartCave()
}   // randomizeCave()

function restartCave() {
    cave.arrows = NUM_ARROWS
    cave.currRoom = cave.start
    if (cave.wumpus > -1 && cave.rooms[cave.wumpus].hazard === Hazard.Wumpus) {
        cave.rooms[cave.wumpus].hazard = Hazard.None
    }   // if (cave.wumpus && cave.rooms[cave.wumpus].hazard === Hazard.Wumpus)
    cave.wumpus = cave.wumpusStart
    cave.rooms[cave.wumpus].hazard = Hazard.Wumpus
    cave.gameOver = false
}   // restartCave()

function shoot(rooms: number[], img: Image, beginY: number): void {
    cave.arrows--
    let text: string = TEXT_ARROW_SHOT + ' ' + cave.currRoom
        + '\n' + TEXT_ARROW_PATH_REQUESTED + ':'
    for (let room of rooms) {
        text += ' ' + room
    }   // for (room)

    // Verify path
    let currRoom: number = cave.currRoom
    let ok: boolean = true
    for (let index: number = 0; index < rooms.length; index++) {
        let room: Room = cave.rooms[currRoom]
        if (ok) {
            ok = (room.links.indexOf(rooms[index]) > -1)
        }   // if (ok)
        if (!ok) {
            rooms[index] = Math.pickRandom(room.links)
        }   // if (! ok)
        currRoom = rooms[index]
    }   // for (index)

    text += '\n' + TEXT_ARROW_PATH_ACTUAL + ':'
    let wumpusHit: boolean = false
    let playerHit: boolean = false
    for (let room of rooms) {
        text += ' ' + room
        if (room === cave.wumpus) {
            wumpusHit = true
        }   // if (room === cave.wumpus)
        if (room === cave.currRoom) {
            playerHit = true
        }   // if (room === cave.currRoom)
    }   // for (room)
    text += '\n'
    if (playerHit) {
        text += TEXT_ARROW_END
        cave.gameOver = true
        cave.win = false
    } else if (wumpusHit) {
        text += TEXT_WUMPUS_END_GOOD
        cave.gameOver = true
        cave.win = true
    } else {
        text += TEXT_ARROW_MISS + '\n' + TEXT_WUMPUS_MOVE
        moveWumpus()
        if (cave.currRoom === cave.wumpus) {
            text += '\n \n' + TEXT_WUMPUS_END_BAD
            cave.gameOver = true
            cave.win = false
        } else if (cave.arrows === 0) {
            text += '\n \n' + TEXT_ARROW_EMPTY
            cave.gameOver = true
            cave.win = false
        }   // if (cave.currRoom === cave.wumpus)
    }   // if (playerHit...)

    let fi: FontInfo = drawStrings.createFontInfo(FontName.Font8)
    drawStrings.writeWrapped(text, img, 0, beginY, screen.width - 1, screen.height - 1,
        TextAlignment.Left, COLOR_CAVE_TEXT, fi)
}   // shoot()

function showCheat(): void {
    let randomRooms: number[] = cave.randomized
    let text: string = randomRooms.length + ' rooms: '
    /*
    for (let id of randomRooms) {
        text += id + ' '
    }   // for (id)
    game.showLongText(text, DialogLayout.Center)
    */

    text = 'Pits:'
    let currRoom: number = 0
    for (let count: number = 0; count < NUM_PITS; count++) {
        text += ' ' + randomRooms[currRoom]
        currRoom++
    }   // for (count)
    text += ' Bats:'
    for (let count: number = 0; count < NUM_SUPERBATS; count++) {
        text += ' ' + randomRooms[currRoom]
        currRoom++
    }   // for (count)
    text += ' Wumpus Start: ' + cave.wumpusStart
        + ' Player Start: ' + cave.start
        + ' Wumpus: ' + cave.wumpus
        + ' Player: ' + cave.currRoom
    game.showLongText(text, DialogLayout.Center)
}   // showCheat()

function shuffle(array: number[]): void {
    for (let index: number = 0; index < array.length; index++) {
        let target: number = Math.randomRange(0, array.length - 1)
        if (index !== target) {
            swap(array, index, target)
        }   // if (index !== swap)
    }   // for (index)
}   // shuffle()

function swap(array: number[], index1: number, index2: number): void {
    let temp: number = array[index1]
    array[index1] = array[index2]
    array[index2] = temp
}   // swap()
