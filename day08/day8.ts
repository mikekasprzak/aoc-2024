if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const lines = input.trim().split("\n");
console.log(lines); 

type Node = [number, number];

const nodes: { [key: string]: Node[] } = {};
const nodePos = new Map<Node, string>();

const height = lines.length;
const width = lines[0].length;

console.log(width, height);

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const value = lines[y][x];
        if (value !== '.') {
            if (value.match(/[A-Za-z0-9]/)) {
                const node: Node = [x, y];
                nodePos.set(node, value);
                nodes[value] = nodes[value] ? [...nodes[value], [x, y]] : [[x, y]];
            }
        }
    }
}

//console.log(nodes);
console.log(nodePos);

const annodePos = new Map<Node, string>();
const newAnnodePos = new Map<Node, string>();

for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    for (let i = 0; i < node.length; i++) {
        for (let j = i + 1; j < node.length; j++) {
            const n1: Node = node[i];
            const n2: Node = node[j];

            const nx = n2[0] - n1[0];
            const ny = n2[1] - n1[1];
            const a1: Node = [n1[0] - nx, n1[1] - ny];
            const a2: Node = [n2[0] + nx, n2[1] + ny];

            console.log(key, ":", n1, n2, "--", nx, ny, "--", a1, a2);

            if (a1[0] >= 0 && a1[0] < width && a1[1] >= 0 && a1[1] < height) {
                annodePos.set(a1, key);
            }
            if (a2[0] >= 0 && a2[0] < width && a2[1] >= 0 && a2[1] < height) {
                annodePos.set(a2, key);
            }

            // Prepopulate newAnnodePos with the current annodePos
            newAnnodePos.set(n1, key);
            newAnnodePos.set(n2, key);

            let b1: Node = [n1[0], n1[1]];
            while (true) {
                b1 = [b1[0] - nx, b1[1] - ny];

                //console.log(a1, b1, key);

                if (b1[0] < 0 || b1[0] >= width || b1[1] < 0 || b1[1] >= height) {
                    break;
                }

                //console.log("+", a1, b1, key);

                newAnnodePos.set(b1, key);
            }
            /*
            b1 = [a1[0], a1[1]];
            while (true) {
                b1 = [b1[0] + nx, b1[1] + ny];

                //console.log(a1, b1, key);

                if (b1[0] < 0 || b1[0] >= width || b1[1] < 0 || b1[1] >= height) {
                    break;
                }

                //console.log("+", a1, b1, key);

                newAnnodePos.set(b1, key);
            }
                **/

            let b2: Node = [n2[0], n2[1]];
            while (true) {
                b2 = [b2[0] + nx, b2[1] + ny];

                //console.log(a2, b2, key);

                if (b2[0] < 0 || b2[0] >= width || b2[1] < 0 || b2[1] >= height) {
                    break;
                }

                //console.log("+",a2, b2, key);

                newAnnodePos.set(b2, key);
            }
            /*
            b2 = [a1[0], a1[1]];
            while (true) {
                b2 = [b2[0] + nx, b2[1] + ny];

                //console.log(a2, b2, key);

                if (b2[0] < 0 || b2[0] >= width || b2[1] < 0 || b2[1] >= height) {
                    break;
                }

                //console.log("+",a2, b2, key);

                newAnnodePos.set(b2, key);
            }
            */
        }
    }
}

console.log(annodePos);

const nodeStrPos = new Set(nodePos.keys().map((key) => {
    return key[0] + "," + key[1];
}));
console.log(nodeStrPos);
const annodeStrPos = new Set(annodePos.keys().map((key) => {
    return key[0] + "," + key[1];
}));
console.log(annodeStrPos);
const newAnnodeStrPos = new Set(newAnnodePos.keys().map((key) => {
    return key[0] + "," + key[1];
}));
console.log(newAnnodeStrPos);

let dupes = 0;
let uniques = 0;
for (const key of annodeStrPos) {
    //console.log("k1", key);
    let localDupes = 0;
    for (const key2 of nodeStrPos) {
        //console.log("k2", key2);
        if (key[0] === key2[0] && key[1] === key2[1]) {
            //console.log(unique, key, "************");
            dupes++;
            localDupes++;
            break;
        }
    }
    if (localDupes === 0) {
        uniques++;
    }
}

console.log(nodeStrPos.size, annodeStrPos.size, newAnnodeStrPos.size);
console.log(dupes, uniques);
console.log(annodePos.size - dupes);
