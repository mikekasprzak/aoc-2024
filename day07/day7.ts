if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);
const lines = input.trim().split("\n");


function isCalibrated(numbers: number[], answer: number): boolean {
    const operators = Array(numbers.length - 1).fill(0);
    let operatorIndex = 0;

    while (operatorIndex < (1 << operators.length)) {
        for (let i = 0; i < operators.length; i++) {
            operators[i] = (operatorIndex >> i) & 1;
        }
        let total = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            const op = operators[i-1];
            const num = numbers[i];
            if (op == 0) {
                total += num;
            }
            else if (op == 1) {
                total *= num;
            }
        }
        if (total == answer) {
            //console.log("Calibrated:", numbers, operators);
            return true;
        }
        operatorIndex++;
    }

    return false;
}

function isCalibrated2(numbers: number[], answer: number): boolean {
    const operators = Array(numbers.length - 1).fill(0);
    let operatorIndex = 0;

    while (operatorIndex < (1 << (operators.length<<1))) {
        for (let i = 0; i < operators.length; i++) {
            operators[i] = (operatorIndex >> (i<<1)) & 3;
        }
        let total = numbers[0];
        let bad = false;
        for (let i = 1; i < numbers.length; i++) {
            const op = operators[i-1];
            const num = numbers[i];
            if (op == 0) {
                total += num;
            }
            else if (op == 1) {
                total *= num;
            }
            else if (op == 2) {
                total = parseInt(total.toString() + num.toString())
            }
            else if (op == 3) {
                bad = true;
            }
        }
        if (!bad && (total == answer)) {
            //console.log("Calibrated:", numbers, operators);
            return true;
        }
        operatorIndex++;
    }

    return false;
}

let totalCalibrated = 0;
let totalCalibrated2 = 0;
for (const line of lines) {
    const answer = parseInt(line.split(":")[0]);
    const numbers = line.split(":")[1].trim().split(/\s+/g).map(x => parseInt(x));

    console.log(answer, numbers);

    if (isCalibrated(numbers, answer)) {
        totalCalibrated += answer;
        //console.log("Calibrated:", numbers);
        //break;
    }
    if (isCalibrated2(numbers, answer)) {
        totalCalibrated2 += answer;
        //console.log("Calibrated:", numbers);
        //break;
    }
}
console.log("Total Calibrated:", totalCalibrated);
console.log("Total Calibrated2:", totalCalibrated2);
