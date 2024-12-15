if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);


const lines = input.trim().split("\n");
//console.log(lines); 

class Machine {
    a: [number, number];
    b: [number, number];
    prize: [number, number];

    constructor() {
        this.a = [0, 0];
        this.b = [0, 0];
        this.prize = [0, 0];
    }
}

const machines = new Array<Machine>();
let machine = null;
for (const line of lines) {
    //console.log(line);
    if (line.startsWith("Button A:")) {
        machine = new Machine();

        const tokens = line.split(" ");        
        machine.a = [parseInt(tokens[2].substring(1,tokens[2].length-1)), parseInt(tokens[3].substring(1))];
    }
    else if (line.startsWith("Button B:")) {
        const tokens = line.split(" ");
        
        if (machine !== null) {
            machine.b = [parseInt(tokens[2].substring(1,tokens[2].length-1)), parseInt(tokens[3].substring(1))];
        }
    }
    else if (line.startsWith("Prize:")) {
        const tokens = line.split(" ");
        
        if (machine !== null) {
            machine.prize = [parseInt(tokens[1].substring(2,tokens[1].length-1)), parseInt(tokens[2].substring(2))];
            machines.push(machine);
        }
    }
}

console.log(machines);

let winners = 0;
let bigWinners = 0;
let totalTokens = 0n;
let bigTotalTokens = 0n;
for (const machine of machines) {
    const bigMachine = {a: [BigInt(machine.a[0]), BigInt(machine.a[1])], b: [BigInt(machine.b[0]), BigInt(machine.b[1])]};

    const prizeError = 10000000000000n;


    //const aBigX = 10000000000000n / BigInt(machine.a[0]);
    //const aBigModX = 0n;// 10000000000000n % BigInt(machine.a[0]);
    //const aBigY = 10000000000000n / BigInt(machine.a[1]);
    //const aBigModY = 0n;//10000000000000n % BigInt(machine.a[1]);
    //console.log(aBig, aBigMod, bBig, bBigMod);

    const bigPrizeX = BigInt(machine.prize[0]);// + error;
    const bigPrizeY = BigInt(machine.prize[1]);// + error;


/*
    const ax = bigPrizeX / bigMachine.a[0];
    const ay = bigPrizeY / bigMachine.a[1];
    const aPreferX = ax < ay;

    const bx = bigPrizeX / bigMachine.b[0];
    const by = bigPrizeY / bigMachine.b[1];
    const bPreferX = bx < by;

    
    let a = aPreferX ? ax : ay;
    let b = bPreferX ? bx : by;
    const preferA = a < b;

    const abx = bigPrizeX / (bigMachine.a[0]+bigMachine.b[0]);
    const aby = bigPrizeX / (bigMachine.a[1]+bigMachine.b[1]);

    a = abx;
    b = aby;

/*
    if (preferA) {
        b = 0n;
    }
    else {
        a = 0n;
    }
*/
   // console.log("Prize:", bigPrizeX, bigPrizeY, "A:", a, "B:", b, aPreferX ? "X" : "Y", bPreferX ? "X" : "Y");




    let a = (bigPrizeX / bigMachine.a[0]);
    let b = 0n;//(bigPrizeY / bigMachine.b[0]);
/*
    const absSumAB = (a < 0n ? -a : a) + (b < 0n ? -b : b);
    //const aFail = 0;//(a - BigInt(machine.a[0]-100n));
    ///console.log("Prize:", bigPrizeX, bigPrizeY, "A:", a, "B:", b);

    let doAlt = false;
    const altA = bigPrizeX / bigMachine.a[1];
    const altB = bigPrizeY / bigMachine.b[0];
    const altAbsSumAB = (altA < 0n ? -altA : altA) + (altB < 0n ? -altB : altB);

    if (absSumAB > altAbsSumAB) {
        a = altA;
        b = altB;
        doAlt = true;
    }
        */

    //console.log("Start A:", a, "B:", b, doAlt ? "ALTERNATIVE" : "");

    

    // A + B = C + D

    // Ax + Bx = Cx + Dx
    // Ay + By = Cy + Dy

    // Ax + Bx = PrizeX + error
    // Ay + By = PrizeY + error

    // NOTE: PrizeX, PrizeY, and error are known values, which we can use to solve A and B

    //  By * (Ax + Bx) =  By * (PrizeX + error)
    // -Bx * (Ay + By) = -Bx * (PrizeY + error)
    // ========================================
    // (By*Ax - Bx*Ay) + (By*Bx - Bx*By) = (By*PrizeX - Bx*PrizeY) + (By*error - Bx*error)

    // (By*Bx - Bx*By) = 0 (always)

    // (By*Ax - Bx*Ay) = (By*PrizeX - Bx*PrizeY) + (By*error - Bx*error)
    // A = ((By*PrizeX - Bx*PrizeY) + (By*error - Bx*error)) / (By*Ax - Bx*Ay)

    const xA = bigMachine.a[0];
    const yA = bigMachine.a[1];
    const xB = bigMachine.b[0];
    const yB = bigMachine.b[1];

    const numA = (yB * bigPrizeX - xB * bigPrizeY) + (yB * prizeError - xB * prizeError);
    const denA = (yB * xA - xB * yA);
    const eqA = numA / denA;
    const eqAMod = numA % denA;

    console.log("EQA", eqA, eqAMod, denA);

    // b = 

    //const linB = (bigPrizeX + prizeError + xA) / yA;
    //const eqB = aY + 
    const numB = (yA * bigPrizeX - xA * bigPrizeY) + (yA * prizeError - xA * prizeError);
    const denB = (yA * xB - xA * yB);
    const eqB = numB / denB;
    const eqBMod = numB % denB;

    console.log("EQB", eqB, eqBMod, denB);
  

    if (eqAMod === 0n && eqBMod === 0n) {
        bigWinners++;
        bigTotalTokens += (eqA*3n) + eqB;
    }


    // Old brute force algorithm
    /*
    while (true) {
        const result = [a * bigMachine.a[0] + b * bigMachine.b[0], a * bigMachine.a[1] + b * bigMachine.b[1]];
        if (result[0] === bigPrizeX && result[1] === bigPrizeY) {
            console.log("**** Winner:", a, b);
            winners++;
            totalTokens += (a*3n) + b;
            break;
        }
        else if (result[0] > bigPrizeX || result[1] > bigPrizeY) {
            a--;
            if (a < 0) {
                console.log("**** IMPOSSIBLE", a, b);
                break;
            }
        }
        else if (result[0] < bigPrizeX || result[1] < bigPrizeY) {
            b++;
        }
    }
    */
    
/*
    const aDivisions = [
        {x: bigMachine.a[0], x_prize: bigPrizeX / bigMachine.a[0], x_rem: bigPrizeX % bigMachine.a[0], a_into_b: bigMachine.a[0] / bigMachine.b[0], a_rem: bigMachine.a[0] % bigMachine.b[0]}, 
        {y: bigMachine.a[1], y_prize: bigPrizeY / bigMachine.a[1], y_rem: bigPrizeY % bigMachine.a[1], a_into_b: bigMachine.a[1] / bigMachine.b[1], a_rem: bigMachine.a[1] % bigMachine.b[1]}
    ];
    const bDivisions = [
        {x: bigMachine.b[0], x_prize: bigPrizeX / bigMachine.b[0], x_rem: bigPrizeX % bigMachine.b[0], b_into_a: bigMachine.b[0] / bigMachine.a[0], b_rem: bigMachine.b[0] % bigMachine.a[0]}, 
        {y: bigMachine.b[1], y_prize: bigPrizeY / bigMachine.b[1], y_rem: bigPrizeY % bigMachine.b[1], b_into_a: bigMachine.b[1] / bigMachine.a[1], b_rem: bigMachine.b[1] % bigMachine.a[1]}
    ];
    const common = [
        {x_a_mul_b: bigMachine.a[0] * bigMachine.b[0], mul_prize: bigMachine.a[0] * bigMachine.b[0] / bigPrizeX},
        {y_a_mul_b: bigMachine.a[1] * bigMachine.b[1], mul_prize: bigMachine.a[1] * bigMachine.b[1] / bigPrizeY}
    ]
    console.log("Prize:", bigPrizeX, bigPrizeY);
    console.log("A Divisions:", aDivisions);
    console.log("B Divisions:", bDivisions);
    console.log("Common:", common);
    */
}

console.log("Winners:", winners, "Total Tokens:", totalTokens);
console.log("Big Winners:", bigWinners, "Total Tokens:", bigTotalTokens);
