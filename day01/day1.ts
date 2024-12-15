
if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const lines = input.split("\n");
const left = [];
const right = [];
const instances:number[] = [];

for (const line of lines) {
    const w = line.split(/\s+/g);
    if (w.length > 1) {
        //console.log(w)
        const [a, b] = w;
        left.push(parseInt(a));
        right.push(parseInt(b));
        instances[parseInt(b)] = (instances[parseInt(b)] ?? 0) + 1;
    }
}

left.sort();
right.sort();

const distances:number[] = [];
const similars:number[] = [];
let totalDistance = 0;
let totalSimilar = 0;
for (let i = 0; i < left.length; i++) {
    const distance = Math.abs(right[i] - left[i]);
    distances.push(distance);
    totalDistance += distance;

    const sim = left[i] * (instances[left[i]] ?? 0);
    similars.push(sim);
    totalSimilar += sim;
}

//console.log(left, right, distances, instances, similars);
console.log("Total Distance:", totalDistance);
console.log("Total Similar:", totalSimilar);
