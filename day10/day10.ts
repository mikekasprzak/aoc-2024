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
    if (x < 0 || y < 0 || x >= width || y >= height) {
        return -1;
    }
    return parseInt(lines[y][x]);
}

function newMap(w: number, h: number) {
    const map = [];
    for (let i = 0; i < h; i++) {
        map.push(new Array(w).fill(-1));
    }
    return map;
}

function getMapPos(map: number[][], x: number, y: number): number {
    if (x < 0 || y < 0 || x >= width || y >= height) {
        return -1;
    }
    return map[y][x];
}

const startPos = [];
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (getPos(x, y) === 0) {
            startPos.push([x, y]);
        }
    }
}

console.log("Start positions:", startPos);

let totalNines = 0;
let totalBranches = 0;
for (const start of startPos) {
    const map = newMap(width, height);
    
    let loops = 0;
    const endPos = [];

    // Count up from zero
    map[start[1]][start[0]] = 0;
    while (true) {
        let changed = false;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const myValue = getMapPos(map, x, y);
                const originalValue = getPos(x, y);
                if (myValue === -1 && originalValue !== -1) {
                    const originalValue = getPos(x, y);
                    // Check each direction for values
                    for (const [nx, ny] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                        const thisValue = getMapPos(map, x + nx, y + ny);
                        if ((thisValue >= 0) && (originalValue - thisValue === 1)) {
                            changed = true;
                            map[y][x] = originalValue;
                            if (originalValue === 9) {
                                endPos.push([x, y]);
                            }
                            break;
                        }
                    }
                }
            }
        }

        if (!changed) {
            break;
        }

        loops++;
    }

    console.log(start, ">", endPos.length, "found in", loops, "loops");
    totalNines += endPos.length;

    console.log("End Positions:",endPos);

    // Count down from all 9's (this will effectively remove dead-end paths)
    for (const end of endPos) {
        console.log("starting from", end);
        
        const map2 = newMap(width, height);
        map2[end[1]][end[0]] = 9;
        while (true) {
            //console.log(end)
            let changed = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const myValue = getMapPos(map2, x, y);
                    const originalValue = getMapPos(map, x, y);
                    if (myValue === -1 && originalValue !== -1) {
                        // Check each direction for values
                        for (const [nx, ny] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                            const thisValue = getMapPos(map2, x + nx, y + ny);
                            if ((thisValue >= 0) && (thisValue - originalValue === 1)) {
                                changed++;
                                map2[y][x] = originalValue;
                                break;
                            }
                        }
                    }
                }
            }

            if (changed === 0) {
                break;
            }
        }


        /*/
        let diff = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (getMapPos(map2, x, y) !== getMapPos(map, x, y)) {
                    //console.log(x, y, getMapPos(map2, x, y), getMapPos(map, x, y));
                    diff++;
                }
            }
        }
        console.log(end, ">", diff, "differences found");
        /**/

        let branches = 0;
        for (let step = 9; step > 0; step--) {
            let subBranches = 0
            let subBranches2 = 0
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const myValue = getMapPos(map2, x, y);
                    if (myValue === step) {
                        let localBranches: number = 0;
                        for (const [nx, ny] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                            const thisValue = getMapPos(map2, x + nx, y + ny);
                            if ((thisValue >= 0) && (myValue === thisValue + 1)) {
                                localBranches++;
                            }
                        }
                        if (localBranches > 0) {
                            subBranches += 1;
                            subBranches2 += localBranches
                        }
                    }
                }   
            }
            const sub = subBranches;
            const sub2 = subBranches2;
            const sub3 = subBranches2 - subBranches;
            const total = sub3 ? (sub3 + 1) : 0;
            branches += total;
            console.log(end, ">", step, ">", sub, sub2, sub3, total, "subbranches found");
        }
        const bran = branches ? branches : 1;
        console.log(end, ">", bran, "branches found");
        totalBranches += bran;
    }
}

console.log("Total Nines:", totalNines)
console.log("Total Branches:", totalBranches);
