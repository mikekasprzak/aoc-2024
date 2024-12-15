if (Deno.args.length < 1) {
    console.log("Usage: deno "+Deno.mainModule.substring(Deno.mainModule.lastIndexOf('/') + 1)+" <input>");
    Deno.exit(1);
}
const input = await Deno.readTextFile(Deno.args[0]);
const lines = input.trim().split("\n");

const width = 101;
const height = 103;
const halfWidth = width / 2;
const halfHeight = height / 2;

class Robot {
    pos: [number, number] = [0, 0];
    velocity: [number, number] = [0, 0];
}

function step(robots: Robot[]) {
    for (const robot of robots) {
        robot.pos[0] += robot.velocity[0];
        robot.pos[1] += robot.velocity[1];

        while (robot.pos[0] < 0) {
            robot.pos[0] += width;
        }
        while (robot.pos[0] >= width) {
            robot.pos[0] -= width;
        }

        while (robot.pos[1] < 0) {
            robot.pos[1] += height;
        }
        while (robot.pos[1] >= height) {
            robot.pos[1] -= height;
        }
    }
}

function draw(robots: Robot[]) {
    const grid = new Array<Array<string>>(height);
    for (let i = 0; i < height; i++) {
        grid[i] = new Array<string>(width);
        for (let j = 0; j < width; j++) {
            grid[i][j] = ".";
        }
    }

    for (const robot of robots) {
        grid[robot.pos[1]][robot.pos[0]] = "#";
    }

    for (let i = 0; i < height; i++) {
        console.log(grid[i].join(""));
    }
}

const robots = new Array<Robot>();

for (const line of lines) {
    console.log(line);

    const token = line.split(" ");
    const pos = token[0].substring(2).split(",");
    const velocity = token[1].substring(2).split(",");

    const robot = new Robot();
    robot.pos = [parseInt(pos[0]), parseInt(pos[1])];
    robot.velocity = [parseInt(velocity[0]), parseInt(velocity[1])];

    robots.push(robot);
}

console.log(robots);

for (let i = 0; i < 10000; i++) {
    const range = i % 101;
    if ((range < 2) || (range > 96)) {
        console.log("Steps", i, range);
        draw(robots);
    }
    step(robots);
}

const quadrant = new Array<Robot[]>(4);
for (const robot of robots) {
    if (robot.pos[0] < (halfWidth | 0) && robot.pos[1] < (halfHeight | 0)) {
        if (quadrant[0] === undefined) {
            quadrant[0] = new Array<Robot>();
        }
        quadrant[0].push(robot);
    }

    if (robot.pos[0] > (halfWidth | 0) && robot.pos[1] < (halfHeight | 0)) {
        if (quadrant[1] === undefined) {
            quadrant[1] = new Array<Robot>();
        }
        quadrant[1].push(robot);
    }

    if (robot.pos[0] < (halfWidth | 0) && robot.pos[1] > (halfHeight | 0)) {
        if (quadrant[2] === undefined) {
            quadrant[2] = new Array<Robot>();
        }
        quadrant[2].push(robot);
    }

    if (robot.pos[0] > (halfWidth | 0) && robot.pos[1] > (halfHeight | 0)) {
        if (quadrant[3] === undefined) {
            quadrant[3] = new Array<Robot>();
        }
        quadrant[3].push(robot);
    }
    //console.log(robot.pos);
}

const qScore = new Array<number>(4);

for (let i = 0; i < 4; i++) {
    qScore[i] = 0;
    if (quadrant[i] !== undefined) {
        for (const robot of quadrant[i]) {
            qScore[i]++;
        }
    }
}

console.log(qScore, qScore[0]*qScore[1]*qScore[2]*qScore[3]);

