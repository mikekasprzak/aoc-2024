if (Deno.args.length < 2) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input_file> <count>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);
const count = parseInt(Deno.args[1]);

if (isNaN(count)) {
    console.log("Invalid count");
    Deno.exit(1);
}

const stones = input.trim().split(" ").map(Number);
console.log(stones); 
/*
function blink(stones: number[]): number[] {
    const newStones: number[] = [];//Array(stones.length*2);
    //let index = 0;

    for (let i = 0; i < stones.length; i++) {
        const stone = stones[i];
        const asString = ""+stone;
        
        //let numDigits = 0;
        //while (stone > 0) {
        //    stone = stone / 10 | 0;
        //    numDigits++;
        //}
        //stone = stones[i];
        
        if (stone === 0) {
            newStones.push(1);
            //stones[i] = 1;
            //newStones[index++] = 1;
        }
        //else if ((numDigits & 1) === 0) {
        else if ((asString.length & 1) === 0) {
            const lhs = parseInt(asString.substring(0, asString.length >> 1));
            const rhs = parseInt(asString.substring(asString.length >> 1));
            //const lhs = stone / 10**(numDigits >> 1) | 0;
            //const rhs = stone % 10**(numDigits >> 1);

            newStones.push(lhs, rhs)
            //stones[i] = lhs;
            //stones.splice(i+1, 0, rhs);
            //newStones[index++] = lhs;
            //newStones[index++] = rhs;
        }
        else {
            newStones.push(stone*2024);
            //stones[i] = stone*2024;
            //newStones[index++] = stone*2024;
        }
    }

    // resize?
    //newStones.length = index;

    return newStones;//stones;
}

for (let i = 0; i < count; i++) {
    stones = blink(stones);
    console.log("Stone Blink:", i, stones.length);//, Deno.memoryUsage());
}
*/

let bucket = new Map<number, number>();
for (let i = 0; i < stones.length; i++) {
    const stone = stones[i];
    if (bucket.has(stone)) {
        bucket.set(stone, (bucket.get(stone) ?? 0) + 1);
    }
    else {
        bucket.set(stone, 1);
    }
}

function blink() {
    const newBucket = new Map<number, number>();
    for (const [stone, count] of bucket) {
        const asString = ""+stone;
        if (stone === 0) {
            newBucket.set(1, (newBucket.get(1) ?? 0) + count);
        }
        else if ((asString.length & 1) === 0) {
            const lhs = parseInt(asString.substring(0, asString.length >> 1));
            const rhs = parseInt(asString.substring(asString.length >> 1));
            newBucket.set(lhs, (newBucket.get(lhs) ?? 0) + count);
            newBucket.set(rhs, (newBucket.get(rhs) ?? 0) + count);
        }
        else {
            newBucket.set(stone*2024, (newBucket.get(stone*2024) ?? 0) + count);
        }
    }

    return newBucket;
}

for (let i = 0; i < count; i++) {
    bucket = blink();
    console.log("Stone Blink:", i, stones.length);//, Deno.memoryUsage());
}

let stoneCount = 0;
for (const [stone, count] of bucket) {
    stoneCount += count;
}

console.log("Stone Count:", stoneCount);

//console.log("Stones:", stones);
//console.log("Stone Count:", stones.length);
