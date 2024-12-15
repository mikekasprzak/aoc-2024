if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const directions = [
    [0,-1],
    [1,0],
    [0,1],
    [-1,0],
];

const directionNames = [
    "UP",
    "RIGHT",
    "DOWN",
    "LEFT",
];

let startFacing = 0;
let startX = 0;
let startY = 0;

const original = input.trim().split("\n");

const width = original[0].length;
const height = original.length;

function getPos(_x: number, _y: number)  {
    if ((_x >= 0 && _x < width) && (_y >= 0 && _y < height)) {
        return original[_y][_x];
    }
    return null;
}

/*
function setPos(_x: number, _y: number, value: string) {
    if ((_x >= 0 && _x < width) && (_y >= 0 && _y < height)) {
        original[_y] = original[_y].substring(0, _x) + value + original[_y].substring(_x + 1);
    }
}
*/

function newGrid() {
    const data = Array(height);
    for (let _y = 0; _y < height; _y++) {
        data[_y] = "" + original[_y]; // shallow copy
    }
    return data;
}


function getGridPos(grid: string[], _x: number, _y: number)  {
    if ((_x >= 0 && _x < width) && (_y >= 0 && _y < height)) {
        return grid[_y][_x];
    }
    return null;
}

function setGridPos(grid: string[], _x: number, _y: number, value: string) {
    if ((_x >= 0 && _x < width) && (_y >= 0 && _y < height)) {
        grid[_y] = grid[_y].substring(0, _x) + value + grid[_y].substring(_x + 1);
    }
}



// Scan the map
for (let _y = 0; _y < height; _y++) {
    for (let _x = 0; _x < width; _x++) {
        const value = getPos(_x, _y);
        // Starting position
        if (value === '^') {
            startX = _x;
            startY = _y;
            startFacing = 0; 

            console.log("Start Position:", [_x, _y], value);
        }
    }
}

type GuardInfo = {
    steps: number;
    turns: number;
    uniqueSteps: number;
    crosses: number;
    duplicateMoves: number;
    duplicateTurns: number;
};

function simulateGuard(obX: number, obY: number): GuardInfo {
    const info: GuardInfo = {
        steps: 0, 
        turns: 0, 
        uniqueSteps: 0,
        crosses: 0, 
        duplicateMoves: 0, 
        duplicateTurns: 0
    };

    const grid = newGrid();
    let facing = startFacing;
    let x = startX;
    let y = startY;

    if (obX === x && obY === y) {
        return info;
    }

    setGridPos(grid, obX, obY, "#");

    while (true) {
        let thisPos = getGridPos(grid, x, y);
        if (thisPos === null) {
            break;
        }
        let nextPos = getGridPos(grid, x + directions[facing][0], y + directions[facing][1]);

        const codeStart = "@".charCodeAt(0);
        const codeEnd = codeStart + 0xF;
        const thisCode = thisPos.charCodeAt(0);

        let oldValue = 0;
        if (thisCode >= codeStart && thisCode <= codeEnd) {
            oldValue = thisCode - codeStart;
            info.crosses++;
        }
        else {//if (thisPos !== "^") { // Starting position is not considered unique
            info.uniqueSteps++;
        }
        
        // If next position is a wall, turn
        if (nextPos !== "#") {
            const facingValue = (1 << facing);
            if (facingValue & oldValue) {
                console.log("DUPLICATE MOVE", obX, obY);
                info.duplicateMoves++;
                break;
            }
            const mergedValue = oldValue | facingValue;
            const mergedCode = codeStart+mergedValue;
            setGridPos(grid, x, y, String.fromCharCode(mergedCode));
            //console.log(directionNames[facing], "("+thisPos+")", [x, y], "=>", String.fromCharCode(mergedCode), "(0x"+oldValue.toString(16)+" | 0x"+facingValue.toString(16)+" = 0x"+mergedValue.toString(16)+")");
        }
        else while (nextPos === "#") {
            // do a turn
            const oldFacing = facing;
            facing = (facing + 1) & 3;
            info.turns++;

            // Write
            const oldFacingValue = 1 << oldFacing;
            const newFacingValue = 1 << facing;
            const mergedFacingValue = oldFacingValue | newFacingValue;
            if (mergedFacingValue & oldValue) {
                console.log("DUPLICATE TURN", obX, obY);
                info.duplicateTurns++;
            }
            const mergedCode = codeStart + (oldValue | mergedFacingValue);
            setGridPos(grid, x, y, String.fromCharCode(mergedCode));

            //console.log("TURN", "{"+thisPos+"}", [x, y], "=>", String.fromCharCode(mergedCode), "(0x"+oldValue.toString(16)+" | 0x"+oldFacingValue.toString(16)+" | 0x"+newFacingValue.toString(16)+" = 0x"+mergedFacingValue.toString(16)+")");
        
            thisPos = getGridPos(grid, x, y);
            nextPos = getGridPos(grid, x + directions[facing][0], y + directions[facing][1]);
            oldValue = mergedCode;
        }

        if (info.duplicateTurns > 64) {
            break;
        }

        // Move
        x += directions[facing][0];
        y += directions[facing][1];
        info.steps++;
    }

    //console.log(grid);

    return info;
}

let validObstructions = 0;
for (let _y = 0; _y < height; _y++) {
    for (let _x = 0; _x < width; _x++) {
        const info = simulateGuard(_x, _y);
        if (info.duplicateMoves > 0 || info.duplicateTurns > 32) {
            validObstructions++;
        }
    }
}

console.log(original);
console.log("Valid Obstructions:", validObstructions);
