if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);

const arrows = ["^", ">", "v", "<"];
const arrowVectors: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const grid = [];
const fatGrid = [];
let moves = "";

function getWidth(grid: string[]) {
    return grid[0].length;
}

function getHeight(grid: string[]) {
    return grid.length;
}

function getValue(grid: string[], x: number, y: number): string {
    if (y < 0 || y >= getHeight(grid) || x < 0 || x >= getWidth(grid)) {
        return " ";
    }
    return grid[y][x];
}

function setValue(grid: string[], x: number, y: number, value: string) {
    grid[y] = grid[y].substring(0, x) + value + grid[y].substring(x + 1);
}

function getFatLine(line: string): string {
    let out = "";
    for (const ch of line) {
        if (ch === "#") {
            out += "##";
        }
        else if (ch === "@") {
            out += "@.";
        }
        else if (ch === "O") {
            out += "[]";
        }
        else if (ch === ".") {
            out += "..";
        }        
    }
    return out;
}

const lines = input.trim().split("\n");
for (const line of lines) {
    if (line.startsWith("#")) {
        grid.push(line);
        fatGrid.push(getFatLine(line));
    }
    else if (arrows.includes(line[0])) {
        moves = moves.concat(line);
    }
}

function findStart(grid: string[]): [number, number] | null {
    for (let y = 0; y < getHeight(grid); y++) {
        for (let x = 0; x < getWidth(grid); x++) {
            if (getValue(grid, x, y) === "@") {
                return [x, y];
            }
        }
    }
    return null;
}   

// Scan map
let robotPos: [number, number] = findStart(grid) ?? [0, 0];

function canMove(grid: string[], pos: [number, number], direction: [number, number]): boolean {
    const what = getValue(grid, pos[0], pos[1]);
    if (what === ".") {
        return true;
    }
    else if (what === "#") {
        return false;
    }
    else if (direction[0] === 0) {
        if (what === "O" || what === "@") {
            return canMove(grid, [pos[0] + direction[0], pos[1] + direction[1]], direction);
        }
        else if (what === "[") {
            return canMove(grid, [pos[0] + 0 + direction[0], pos[1] + direction[1]], direction) && canMove(grid, [pos[0] + 1 + direction[0], pos[1] + direction[1]], direction);
        }
        else if (what === "]") {
            return canMove(grid, [pos[0] - 1 + direction[0], pos[1] + direction[1]], direction) && canMove(grid, [pos[0] + 0 + direction[0], pos[1] + direction[1]], direction);
        }
    }
    else {
        if (what === "O" || what === "@" || what === "[" || what === "]") {
            return canMove(grid, [pos[0] + direction[0], pos[1] + direction[1]], direction);
        }
    }

    console.log("Unknown Item:", what, what.charCodeAt(0));
    return false;
}

function doMove(grid: string[], pos: [number, number], direction: [number, number]) {
    const what = getValue(grid, pos[0], pos[1]);
    if (direction[0] === 0) {
        if (what === "O" || what === "@") {
            doMove(grid, [pos[0] + direction[0], pos[1] + direction[1]], direction);
            setValue(grid, pos[0] + direction[0], pos[1] + direction[1], what);
            setValue(grid, pos[0], pos[1], ".");
        }
        else if (what === "[") {
            doMove(grid, [pos[0] + 0 + direction[0], pos[1] + direction[1]], direction);
            doMove(grid, [pos[0] + 1 + direction[0], pos[1] + direction[1]], direction);

            setValue(grid, pos[0] + 0 + direction[0], pos[1] + direction[1], "[");
            setValue(grid, pos[0] + 1 + direction[0], pos[1] + direction[1], "]");
            setValue(grid, pos[0] + 0, pos[1], ".");
            setValue(grid, pos[0] + 1, pos[1], ".");
        }
        else if (what === "]") {
            doMove(grid, [pos[0] - 1 + direction[0], pos[1] + direction[1]], direction);
            doMove(grid, [pos[0] + 0 + direction[0], pos[1] + direction[1]], direction);

            setValue(grid, pos[0] - 1 + direction[0], pos[1] + direction[1], "[");
            setValue(grid, pos[0] + 0 + direction[0], pos[1] + direction[1], "]");
            setValue(grid, pos[0] - 1, pos[1], ".");
            setValue(grid, pos[0] + 0, pos[1], ".");
        }
    }
    else {
        if (what === "O" || what === "@" || what === "[" || what === "]") {
            doMove(grid, [pos[0] + direction[0], pos[1] + direction[1]], direction);
            setValue(grid, pos[0] + direction[0], pos[1] + direction[1], what);
            setValue(grid, pos[0], pos[1], ".");
        }
    }

    if (what === "@") {
        robotPos[0] = robotPos[0] + direction[0];
        robotPos[1] = robotPos[1] + direction[1];
    }
}

function findEmpty(grid: string[], robotPos: [number, number], direction: [number, number]): [number, number] | null {
    let newPos = [robotPos[0] + direction[0], robotPos[1] + direction[1]];
    while (getValue(grid, newPos[0], newPos[1]) !== "#") {
        //console.log("fe", newPos, getValue(grid, newPos[0], newPos[1]));
        if (getValue(grid, newPos[0], newPos[1]) === ".") {
            return [newPos[0], newPos[1]];
        }
        newPos = [newPos[0] + direction[0], newPos[1] + direction[1]];
    }
    return null;
}

function moveRobot(grid: string[], robotPos: [number, number], direction: [number, number]) {
    let emptySpace = findEmpty(grid, robotPos, direction);
    if (emptySpace !== null) {
        while (getValue(grid, emptySpace[0], emptySpace[1]) !== "@") {
            setValue(grid, emptySpace[0], emptySpace[1], getValue(grid, emptySpace[0] - direction[0], emptySpace[1] - direction[1]));
            emptySpace = [emptySpace[0] - direction[0], emptySpace[1] - direction[1]];
        }

        robotPos[0] = robotPos[0] + direction[0];
        robotPos[1] = robotPos[1] + direction[1];
        setValue(grid, emptySpace[0], emptySpace[1], ".");

        return;
    }

    //console.log("DID NOT MOVE! ROBOT:", robotPos, direction, "EMPTY:", emptySpace);
}

for (let idx = 0; idx < moves.length; idx++) {
    const move = moves[idx];
    const direction: [number, number] = arrowVectors[arrows.indexOf(move)];

    moveRobot(grid, robotPos, direction);    
}

let Score = 0;
for (let y = 0; y < getHeight(grid); y++) {
    for (let x = 0; x < getWidth(grid); x++) {
        if (getValue(grid, x, y) === "O") {
            Score += (100*y) + x
        }
    }
}
console.log("Part1 Score", Score);

console.log(fatGrid);

robotPos = findStart(fatGrid) ?? [0, 0];

for (let idx = 0; idx < moves.length; idx++) {
    const move = moves[idx];
    const direction: [number, number] = arrowVectors[arrows.indexOf(move)];

    if (canMove(fatGrid, robotPos, direction)) {
        doMove(fatGrid, robotPos, direction);  
    }
}

let fatScore = 0;
for (let y = 0; y < getHeight(fatGrid); y++) {
    for (let x = 0; x < getWidth(fatGrid); x++) {
        if (getValue(fatGrid, x, y) === "[") {
            fatScore += (100*y) + x
        }
    }
}

console.log(fatGrid);
console.log("Part2 Score", fatScore);
