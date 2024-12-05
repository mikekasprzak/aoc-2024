if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const lines = input.trim().split("\n");
//console.log(lines); 


const offsets = [
    [1,0],
    [-1,0],
    [0,1],
    [0,-1],

    [1,1],
    [-1,1],
    [1,-1],
    [-1,-1]
];

const solutions = [
    [
        'M.S',
        '.A.',
        'M.S'
    ],
    [
        'M.M',
        '.A.',
        'S.S'
    ],
    [
        'S.M',
        '.A.',
        'S.M'
    ],
    [
        'S.S',
        '.A.',
        'M.M'
    ],
];


let total = 0;
let totalMas = 0;
const search = "XMAS";

const height = lines.length;
for (let y = 0; y < height; y++) {
    const width = lines[y].length;
    for (let x = 0; x < width; x++) {
        // Solution 1
        const s = [0, 0, 0, 0, 0, 0, 0, 0];

        // Scan in all directions
        for (let ch = 0; ch < search.length; ch++) {
            for (let key = 0; key < offsets.length; key++) {
                const offset = offsets[key];
                const vx = offset[0]
                const vy = offset[1]
                const _x = x + ch*vx;
                const _y = y + ch*vy;

                if ((vx > 0) && (_x >= width)) {
                    continue;
                }
                if ((vx < 0) && (_x < 0)) {
                    continue;
                }

                if ((vy > 0) && (_y >= height)) {
                    continue;
                }
                if ((vy < 0) && (_y < 0)) {
                    continue;
                }

                if (lines[_y][_x] === search[ch]) {
                    s[key]++;
                }
            }
        }

        {
            let found = 0;
            for (let idx = 0; idx < s.length; idx++) {
                if (s[idx] === search.length) {
                    found++;
                    total++;

                    // destroy this value to stop future matches
                    //lines[y] = lines[y].substring(0, x) + "." + lines[y].substring(x+1);
                }
            }
            //console.log(found);
        }

        // Solution 2
        for (const sol of solutions) {
            //const sol = solutions[0];
            let found = 0;
            for (let yy = 0; yy < sol.length; yy++) {
                for (let xx = 0; xx < sol[yy].length; xx++) {
                    if (sol[yy][xx] != '.') {
                        if (y > height-3) {
                            continue;
                        }
                        else if (x > width-3) {
                            continue;
                        }

                        if (lines[y+yy][x+xx] === sol[yy][xx]) {
                            found++;
                        }
                    }
                }
            }
            if (found == 5) {
                totalMas++;
            }
        }
    }
    console.log(lines[y])
}

console.log(total, totalMas)//, totalUnique, Object.values(where).length);
