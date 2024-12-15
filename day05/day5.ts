if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const lines = input.trim().split("\n");
//console.log(lines); 

const rules: { [key: string]: [value: string] } = {};//new Map();
const docs = [];

for (const line of lines) {
    if (line.includes("|")) {
        const [key, value] = line.split("|");
        //rules.set(key, value);
        if (!rules[key]) {
            rules[key] = [value]
        }
        else {
            rules[key].push(value);
        }
        //console.log(key, value)
    } 
    else if (line.includes(",")) {
        docs.push(line.split(","));
    }
}
//console.log(rules, docs);

// Parse docs
let totalGoodDocScore = 0;
let totalBadDocScore = 0;
for (const doc of docs) {
    let bad = false;
    for (let i = 0; i < doc.length; i++) {
        // if there's a rule for this page number
        const page = doc[i];
        if (rules[page]) {
            for (let j = 0; j < i; j++) {
                const vs = doc[j];
                if ( rules[page].includes(vs) ) {
                    bad = true;
                    doc.splice(i+1, 0, doc[doc.indexOf(vs)]);
                    doc.splice(doc.indexOf(vs), 1);
                    //i = -1; // slow, starting the document over
                    i--; // fast, taking 1 step back... though I'm not sure why 1 step back was enough, and not 2
                    break;
                }
            }
        }
    }

    if (!bad) {
        const mid = (doc.length >> 1);
        console.log("GOOD:", mid, doc.length, /*doc,*/ ":", doc[mid]);
        totalGoodDocScore += parseInt(doc[mid]);
    }
    else {
        const mid = (doc.length >> 1);
        console.log("BAD:", mid, doc.length, /*doc,*/ ":", doc[mid]);
        totalBadDocScore += parseInt(doc[mid]);
    }
}
console.log(totalGoodDocScore, totalBadDocScore);
