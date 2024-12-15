
if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const lines = input.split("\n");
//console.log(lines); 

let total = 0;
let doMath:boolean = true;
console.log("MATH: Enabled");
//const regex =  /mul\((\d+)\,(\d+)\)/;
const regex =  /mul\((\d+)\,(\d+)\)|do\(\)|don\'t\(\)/;
for (let line of lines) {
    while (line) {
        const match = line.match(regex);
        const [success, a, b] = match ?? [];
        if (!success) {
            break;
        }

        if (success.indexOf("don't()") == 0) {
            doMath = false;
            console.log("MATH: Disabled");
        }
        else if (success.indexOf("do()") === 0) {
            doMath = true;
            console.log("MATH: Enabled");
        }
        else if ( success.indexOf("mul(") === 0) {
            if (doMath) {
                const value = parseInt(a) * parseInt(b);
                console.log(a, "*", b, "=", value);//match?.index);
                total += value;
            }
            else {
                console.log(a, "*", b, "= ignored");//, match?.index ?? 0);
            }
        }
    
        if (match && match.index !== undefined) {
            line = line.substring(match.index+1)
        }
    }
}
console.log("Total:", total);
