
if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


function isSafe(w: number[]): boolean {
    let minDiff = 1024;
    let maxDiff = -1;
    let inc = 0;
    let dec = 0;
    for (let i = 1; i < w.length; i++) {
        const a = w[i-1];
        const b = w[i];
        const diff = Math.abs(b - a);
        if (b > a) {
            inc++;
        }
        else if (b < a) {
            dec++;
        }

        if (diff < minDiff) {
            minDiff = diff;
        }
        if (diff > maxDiff) {
            maxDiff = diff;
        }
    }
    return (inc == w.length - 1 || dec == w.length - 1) && (minDiff >= 1 && maxDiff <= 3);
}

let totalSafe = 0;
let totalSafer = 0;

const lines = input.split("\n");
for (const line of lines) {
    const w = line.split(/\s+/g).map(x => parseInt(x));

    if ( w.length < 2 )
        continue;

    //console.log(w);

    if (isSafe(w)) {
        totalSafe++;
        totalSafer++;
        //console.log(w, true);
    }
    else {
        //console.log(w, false);
        for (let j = 0; j < w.length; j++) {
            const subW = w.slice(0, j).concat(w.slice(j+1));
            if (isSafe(subW)) {
                totalSafer++;
                //console.log(subW, true);
                break;
            }
            else {
                //console.log(subW, false);
            }
        }
    }

}

console.log("Total Part 1:", totalSafe);
console.log("Total Part 2:", totalSafer);
