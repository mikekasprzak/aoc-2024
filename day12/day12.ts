if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const lines = input.trim().split("\n");
console.log(lines);

const width = lines[0].length;
const height = lines.length;

function getPos(x: number, y: number): number {
    if (x < 0 || x >= width || y < 0 || y >= height) {
        return -1;
    }
    return lines[y][x].charCodeAt(0) - 'A'.charCodeAt(0);
}

function newGrid(): number[][] {
    const grid = new Array(height);
    for (let j = 0; j < height; j++) {
        grid[j] = new Array(width).fill(-1);
    }

    return grid;
}

function getGridPos(grid: number[][], x: number, y: number): number {
    if (x < 0 || x >= width || y < 0 || y >= height) {
        return -1;
    }
    return grid[y][x];
}

function newCloneGrid(): number[][] {

    const grid = newGrid();
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            grid[y][x] = getPos(x, y);
        }
    }

    return grid;
}

function moveRegion(src: number[][], dest: number[][], x: number, y: number, value: number | null = null) {
    if (value === null) {
        value = getGridPos(src, x, y);
    }

    if (value === -1) {
        return;
    }

    if (getGridPos(src, x, y) === value) {
        dest[y][x] = value;
        src[y][x] = -1;

        moveRegion(src, dest, x-1, y, value);
        moveRegion(src, dest, x+1, y, value);
        moveRegion(src, dest, x, y-1, value);
        moveRegion(src, dest, x, y+1, value);
    }
}

function calcRegionSides(grid: number[][]) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (getGridPos(grid, x, y) !== -1) {
                let flags = 0;
                if (getGridPos(grid, x-1, y) === -1) {
                    flags |= 0x1;
                }
                if (getGridPos(grid, x+1, y) === -1) {
                    flags |= 0x2;
                }
                if (getGridPos(grid, x, y-1) === -1) {
                    flags |= 0x4;
                }
                if (getGridPos(grid, x, y+1) === -1) {
                    flags |= 0x8;
                }
                grid[y][x] = flags;
            }
        }
    }   
}

function getRegionArea(grid: number[][]): number {
    let count = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (getGridPos(grid, x, y) !== -1) {
                count++;
            }
        }
    }
    return count;
}

function getRegionPerimeter(grid: number[][]): number {
    let count = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (getGridPos(grid, x, y) !== -1) {
                if (getGridPos(grid, x-1, y) === -1) {
                    count++;
                }
                if (getGridPos(grid, x+1, y) === -1) {
                    count++;
                }
                if (getGridPos(grid, x, y-1) === -1) {
                    count++;
                }
                if (getGridPos(grid, x, y+1) === -1) {
                    count++;
                }
            }
        }
    }   

    return count;
}

function countRegionSides(grid: number[][]): number {
    let count = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = getGridPos(grid, x, y);
            if (value !== -1) {
                // Top
                if ((value & 0x4) === 0x4) {
                    let size = 1;
                    grid[y][x] &= 0x4 ^ -1;
                    while (getGridPos(grid, x+size, y) !== -1 && (getGridPos(grid, x+size, y) & 0x4) === 0x4) {
                        grid[y][x+size] &= 0x4 ^ -1;
                        size++;
                    }
                    count++;
                }
                // Bottom
                if ((value & 0x8) === 0x8) {
                    let size = 1;
                    grid[y][x] &= 0x8 ^ -1;
                    while (getGridPos(grid, x+size, y) !== -1 && (getGridPos(grid, x+size, y) & 0x8) === 0x8) {
                        grid[y][x+size] &= 0x8 ^ -1;
                        size++;
                    }
                    count++;
                }

                // Left
                if ((value & 0x1) === 0x1) {
                    let size = 1;
                    grid[y][x] &= 0x1 ^ -1;
                    while (getGridPos(grid, x, y+size) !== -1 && (getGridPos(grid, x, y+size) & 0x1) === 0x1) {
                        grid[y+size][x] &= 0x1 ^ -1;
                        size++;
                    }
                    count++;
                }
                // Right
                if ((value & 0x2) === 0x2) {
                    let size = 1;
                    grid[y][x] &= 0x2 ^ -1;
                    while (getGridPos(grid, x, y+size) !== -1 && (getGridPos(grid, x, y+size) & 0x2) === 0x2) {
                        grid[y+size][x] &= 0x2 ^ -1;
                        size++;
                    }
                    count++;
                }
            }
        }
    }
    
    return count;
}

const grid = newCloneGrid();
//console.log(grid);
//const regions = [];

let totalFenceCost = 0;
let totalDiscountedFenceCost = 0;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (getGridPos(grid, x, y) !== -1) {
            const region = newGrid();
            moveRegion(grid, region, x, y);
            //console.log(region);
            const area = getRegionArea(region);
            const perimeter = getRegionPerimeter(region);
            totalFenceCost += area*perimeter;
            console.log("Area:", area, "Perimeter:", perimeter);
            calcRegionSides(region);
            const sides = countRegionSides(region);
            //console.log(region);
            totalDiscountedFenceCost += area*sides;

            //regions.push(region);
        }
    }
}

console.log("Total Fence Cost:", totalFenceCost);
console.log("Total Discounted Fence Cost:", totalDiscountedFenceCost);
