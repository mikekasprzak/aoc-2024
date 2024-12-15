if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const line = input.trim();//.split("\n");
//console.log(line); 

// Expand file blocks and free space
let fileId = 0;
let totalFreeSpace = 0;
let out: number[] = [];
const fileSizes: { [key: number]: number[] } = {};
const freeSpaces = [];
for (let i = 0; i < line.length; i++) {
    const len: number = parseInt(line[i]);
    
    // File Block
    if ((i & 1) === 0) {
        fileSizes[fileId] = [out.length, len];
        out = out.concat(new Array(len).fill(fileId));
        fileId++;
    }
    // Free Space
    else {
        freeSpaces.push([out.length, len])
        out = out.concat(new Array(len).fill(-1));
        totalFreeSpace += len;
    }
}

const copy = out.slice();


//console.log(out, out.length, totalFreeSpace);

// Condense file blocks into free space
for (let i = 0; i < totalFreeSpace; i++) {
    const value = out.pop();
    const index = out.indexOf(-1);
    if ( index !== -1 && value !== undefined) {
        out[index] = value;
    }
}

//console.log(out, out.length);

let crc = 0;
for (let i = 0; i < out.length; i++) {
    const value = out[i];
    if (value !== -1) {
        crc += i * value;
    }
}

console.log("CRC:", crc);


const fs2 = Object.entries(fileSizes).reverse();
//console.log(fs2);

for (const f of fs2) {
    const file = f[1];
    for (let i = 0; i < freeSpaces.length; i++) {
        const free = freeSpaces[i];
        //console.log(f, free);
        if ((free[1] >= file[1]) && (free[0] < file[0])) {
            //console.log("FITS:", f, free);
            copy.fill(parseInt(f[0]), free[0], free[0] + file[1]); // overwrite free space
            copy.fill(-1, file[0], file[0] + file[1]);  // erase original
            free[0] += file[1];
            free[1] -= file[1];
            break;
        }
    }
}


let totalCRC:bigint = 0n;
for (let i = 0; i < copy.length; i++) {
    const value = BigInt(copy[i]);
    if (value !== -1n) {
        const crc = BigInt(i) * value;
        totalCRC += crc;
    }
}

console.log("CRC2:", totalCRC.toString());

