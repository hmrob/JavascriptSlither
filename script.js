/*TO-DO:
- refine psychs
*/
const canvas2 = document.getElementById("paintSim");
var context = canvas2.getContext('2d');
const xCenter = canvas2.width / 2;
const yCenter = canvas2.height / 2;

//Pos and enemypos are arrays that hold the xy coords for the bodies of our snakes. 
var pos = [[0, 0]]
var enemypos = []

//cpos, short for candy positions, holds the positions of all our candy 
var cpos = []

//how many times our snake has moved
var count = 0

//determines when new candy appears
var candyRand = 0

// ai variables for our enemy snake
// enemydir is which direction the snake goes
// enemypace is how long the snake goes in that direction
var enemyxdir = 0
var enemyydir = 0
var enemypace = 0

//determines if the game is over or ont
var gameon = true;


/***
 * How the game works:
 * A copy of slither.io
 * without the fancy graphics
 */
window.onload = init;

function init() {
    newEnemy();
    update();
}

function update() {
    context.clearRect(0, 0, canvas2.height, canvas2.width);
    for (let i = 0; i < pos.length; i++) {
        draw(pos[i][0] + xCenter, pos[i][1] + yCenter, 5, 'blue');
    }

    for (let i = 0; i < enemypos.length; i++) {
        draw(enemypos[i][0] + xCenter, enemypos[i][1] + yCenter, 5, 'red');
    }

    for (let i = 0; i < pos.length; i++) {
        for (let j = 0; j < enemypos.length; j++) {
            if (checkDistance(pos[i][0] + xCenter, pos[i][1] + yCenter,
                enemypos[j][0] + xCenter, enemypos[j][1] + yCenter)) {
                context.clearRect(0, 0, canvas2.height, canvas2.width);
                context.font = "30px Arial";
                context.textAlign = "center";
                context.fillText("Game Over", xCenter, yCenter); 
                cpos = [];
                gameon = false;
            }
        }
    }

    //position of 'head' of snake
    x1 = pos[0][0] + xCenter;
    y1 = pos[0][1] + yCenter;

    //position of 'head' of enemy snake
    xe = enemypos[0][0] + xCenter;
    ye = enemypos[0][1] + yCenter;

    //draws applas and checks to see if a snake has eaten them
    for (let i = 0; i < cpos.length; i++) {
        x2 = cpos[i][0] + xCenter;
        y2 = cpos[i][1] + yCenter;
        if (checkDistance(x1, y1, x2, y2)) {
            eatApple(i);
        }
        if (checkDistance(xe, ye, x2, y2)) {
            enemyApple(i);
        }
        draw(x2, y2, 2, 'green');
    }


    if (count > candyRand) {
        candyRand = newCandy(count);
    }
    count = count + 1;
}

// our snake eats an apple and gets longer
function eatApple(index) {
    cpos.splice(index, 1);
    pos.push(pos[pos.length - 1]);
}


// enemy snake eats an apple and gets longer
function enemyApple(index) {
    cpos.splice(index, 1);
    enemypos.push(enemypos[enemypos.length - 1]);
}

// is the snake close enough to eat the apple?
function checkDistance(x1, y1, x2, y2) {
    xdiff = x1 - x2
    ydiff = y1 - y2
    if (Math.sqrt((xdiff * xdiff) + (ydiff * ydiff)) < 5) {
        return true
    }
    return false
}

// adds a new candy apple to the screen
function newCandy(count) {
    xpos = Math.floor(Math.random() * xCenter)
    ypos = Math.floor(Math.random() * yCenter)
    if (count % 4 == 1) {
        xpos = -xpos
    }
    else if (count % 4 == 2) {
        xpos = -xpos
        ypos = -ypos
    }
    else if (count % 4 == 3) {
        ypos = -ypos
    }
    cpos.unshift([xpos, ypos])
    return count + Math.floor(Math.random() * 10)
}

// draws the circles
function draw(x, y, r, color) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

// create new enemy snake 
function newEnemy() {
    //randomly initializes the enemy snake position
    enemypos = [[Math.floor(Math.random() * xCenter * 2) - xCenter, Math.floor(Math.random() * yCenter * 2) - yCenter]];
    enemyturn();
}

// ai for enemy snake; essentially it goes straight for a given distance then randomly turns
// this decides the distance and which direction it turns
function enemyturn() {
    // algorithm - either 1, -1, or 0
    let coinflip = Math.floor(Math.random() * xCenter);
    console.log("turn: " + coinflip);
    enemyxdir = coinflip % 2 * (2 - coinflip % 4);
    coinflip = coinflip + 1;
    enemyydir = coinflip % 2 * (2 - coinflip % 4);
    enemypace = enemypace + 10;
}

////// Arrow keys //////

function move(e) {
    if (gameon) {
        let xpos = pos[0][0]
        let ypos = pos[0][1]

        if (e.keyCode == 37 && pos[0][0] > 0 - xCenter) {
            xpos = xpos - 5;
        }
        if (e.keyCode == 38 && ypos > 0 - yCenter) {
            ypos = ypos - 5;
        }
        if (e.keyCode == 39 && xpos < xCenter) {
            xpos = xpos + 5;
        }
        if (e.keyCode == 40 && ypos < yCenter) {
            ypos = ypos + 5;
        }

        let len = pos.length;
        pos.unshift([xpos, ypos]);
        pos.length = len;

        enemyMotion();

        update();
    }
}

document.onkeydown = move;

//controls the red snake AI
function enemyMotion() {
    let xpos = enemypos[0][0]
    let ypos = enemypos[0][1]

    xpos = xpos + 5 * enemyxdir;
    ypos = ypos + 5 * enemyydir;

    //if enemy snake is out of bounds, sends it back
    if (xpos < 0 - xCenter) {
        enemyxdir = 1;
        enemyydir = 0;
        enemypace = enemypace + xCenter / 6;
    }
    else if (xpos > xCenter) {
        enemyxdir = -1;
        enemyydir = 0;
        enemypace = enemypace + xCenter / 6;
    }

    if (ypos < 0 - yCenter) {
        enemyxdir = 0;
        enemyydir = 1;
        enemypace = enemypace + yCenter / 6;
    }
    else if (ypos > yCenter) {
        enemyxdir = 0;
        enemyydir = -1;
        enemypace = enemypace + yCenter / 6;
    }

    let len = enemypos.length;
    enemypos.unshift([xpos, ypos]);
    enemypos.length = len;

    console.log(enemypace);
    if (count > enemypace) {
        enemyturn();
    }
}