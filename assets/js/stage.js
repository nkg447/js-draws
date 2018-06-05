var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight - 150;
canvas.width = window.innerWidth - 100;
var ctx = canvas.getContext("2d");

var offset = 20;

var currentX = 0;
var leftPressed = false;
var rightPressed = false;


var effectiveWidth = canvas.width - offset;
var effectiveHeight = canvas.height - offset;

var groundColor = "brown";
var groundHeight = effectiveHeight / 5;
var groundCount = 4;
var grounds = [];

var allOffset = (canvas.width / 10) * 5 + 300;

grounds[0] = {x1: 0, x2: 1040 + allOffset};
grounds[1] = {x1: 1080 + allOffset, x2: 1320 + allOffset};
grounds[2] = {x1: 1360 + allOffset, x2: 2360 + allOffset};
grounds[3] = {x1: 2400 + allOffset, x2: 3280 + allOffset};

var pipeWidth = 40;
var pipeColor = "#32CD32";
var pipesCount = 5;
var pipes = [];
pipes[0] = {x1: 100 + allOffset, height: 50};
pipes[1] = {x1: 350 + allOffset, height: 50};
pipes[2] = {x1: 650 + allOffset, height: 50};
pipes[3] = {x1: 1400 + allOffset, height: 50};
pipes[4] = {x1: 2500 + allOffset, height: 50};

var mountainCount = 5;
var mountainColor = "#006400";
var mountains = [];
mountains[0] = {x: 90 + allOffset, width: 200, height: 110};
mountains[1] = {x: 750 + allOffset, width: 200, height: 80};
mountains[2] = {x: 1500 + allOffset, width: 200, height: 100};
mountains[3] = {x: 1900 + allOffset, width: 200, height: 90};
mountains[4] = {x: 2550 + allOffset, width: 200, height: 75};

var rightLimit = grounds[groundCount - 1].x2 - canvas.width;

var cloud = new Image();
cloud.src = "assets/img/cloud.png";

//   __
//  |  |
// |    |
// |____|
var marioColor = "red";
var marioHeight = canvas.height / 20;
var marioWidth = 25;
var jumpHeight = 0;
for (var i = 0; i < pipesCount; i++) {
    jumpHeight = Math.max(jumpHeight, pipes[i].height);
}
jumpHeight += 20;
var marioBottomY = effectiveHeight - groundHeight;
var marioX = effectiveWidth / 2 - 50;
var marioY = 0;
var marioTopX = marioX + marioWidth / 4;
var marioTopY = marioY - marioHeight / 2;
var currentJumpHeight = 0;
var jumping = false;
console.log("jump height - " + jumpHeight);

var marioYrequired = marioBottomY - marioHeight;
var pipeDetected = false;

var ditchDetected = false;

var brickCount = 4;
var brickSize = 20;
var brickColor = "#f4a460"
var bricks = [];
bricks[0] = {x: 800, coin: true, visible: true};
bricks[1] = {x: 820, coin: false, visible: true};
bricks[2] = {x: 840, coin: true, visible: true};
bricks[3] = {x: 860, coin: false, visible: true};

function drawGrounds() {
    for (var i = 0; i < groundCount; i++) {
        ctx.beginPath();
        ctx.rect(grounds[i].x1 - currentX, effectiveHeight - groundHeight, grounds[i].x2 - grounds[i].x1, groundHeight);
        ctx.fillStyle = groundColor;
        ctx.fill();
        ctx.closePath();
    }
}

function drawPipes() {
    for (var i = 0; i < pipesCount; i++) {
        ctx.beginPath();
        ctx.rect(pipes[i].x1 - currentX, effectiveHeight - groundHeight - pipes[i].height, pipeWidth, pipes[i].height);
        ctx.fillStyle = pipeColor;
        ctx.fill();
        ctx.closePath();
    }
}

function drawMountains() {
    for (var i = 0; i < mountainCount; i++) {
        ctx.beginPath();

        ctx.moveTo(mountains[i].x - currentX, effectiveHeight - groundHeight);
        ctx.lineTo(mountains[i].x + mountains[i].width - currentX, effectiveHeight - groundHeight);
        ctx.lineTo(mountains[i].x + mountains[i].width / 2 - currentX, effectiveHeight - groundHeight - mountains[i].height);

        ctx.fillStyle = mountainColor;
        ctx.fill();
        ctx.closePath();
    }
}

function drawClouds() {
    ctx.drawImage(cloud, 50, 80);
    ctx.drawImage(cloud, 550, 30);
    ctx.drawImage(cloud, 800, 30);
}

function drawBricks() {
    for (var i = 0; i < brickCount; i++) {
        if (bricks[i].visible) {
            ctx.beginPath();
            ctx.rect(bricks[i].x - currentX, effectiveHeight - groundHeight - 100, brickSize, brickSize);
            ctx.fillStyle = brickColor;
            ctx.fill();
            ctx.closePath();

            if (bricks[i].coin) {
                ctx.fillStyle = "black";
                ctx.font = "10px Verdana";
                ctx.fillText("?", bricks[i].x - currentX + 10, effectiveHeight - groundHeight - 85);
            }
        }
    }
}

function drawStage() {
    drawClouds();
    drawMountains();
    drawGrounds();
    drawPipes();
    drawBricks();
}

function drawMario() {
    ctx.beginPath();
    marioY = marioBottomY - marioHeight - currentJumpHeight;
    ctx.rect(marioX, marioY, marioWidth, marioHeight);
    marioTopY = marioY - marioHeight / 2;
    ctx.rect(marioTopX, marioTopY, marioWidth / 2, marioHeight / 2);
    ctx.fillStyle = marioColor;
    ctx.fill();
    ctx.closePath();
}

function pipeDetection() {
    for (var i = 0; i < pipesCount; i++) {
        if ((marioX >= (pipes[i].x1 - currentX) &&
            marioX <= (pipes[i].x1 + pipeWidth - currentX)) ||
            ((marioX + marioWidth) >= (pipes[i].x1 - currentX) &&
                (marioX + marioWidth) <= (pipes[i].x1 + pipeWidth - currentX))) {
            marioYrequired = marioBottomY - marioHeight - pipes[i].height;
            pipeDetected = true;
            return;
        }
    }
    pipeDetected = false;
    marioYrequired = marioBottomY - marioHeight;
}

function ditchDetection() {
    for (var i = 0; i < groundCount - 1; i++) {
        if (marioX >= grounds[i].x2 - currentX && marioX + marioWidth <= grounds[i + 1].x1 - currentX && marioY + marioHeight == marioBottomY) {
            ditchDetected = true;
            currentJumpHeight = canvas.height;
            return;
        }
    }
    ditchDetected = false;
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "80px Verdana";
    ctx.fillText("Game Over", 200, 200);
}

function brickDetection() {
    for (var i = 0; i < brickCount; i++) {
        if (marioTopX > bricks[i].x - currentX && marioTopX <= (bricks[i].x + brickSize - currentX) ||
            marioTopY > bricks[i].x - currentX && marioTopY <= (bricks[i].x + brickSize - currentX)) {
            if (jumping) {
                bricks[i].visible = false;
            }
            marioHeight = canvas.height / 20 + 20;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStage();
    drawMario();

    if (marioY <= marioYrequired) {
        if (rightPressed) {
            currentX += 5;
            if (currentX > rightLimit) {
                currentX = rightLimit;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = "80px Verdana";
                ctx.fillText("You Win", 200, 200);
                cancelAnimationFrame();
            }
        }
        if (leftPressed) {
            currentX -= 5;
            if (currentX < 0) {
                currentX = 0;
            }
        }
    }

    if (currentJumpHeight > 0 || jumping) {
        if (jumping && currentJumpHeight < jumpHeight) {
            currentJumpHeight += 3;
        }
        else if (pipeDetected || ((marioY - marioYrequired) == Math.abs(3))) {
            jumping = false;
            currentJumpHeight = marioBottomY - marioHeight - marioYrequired;
        }
        else {
            jumping = false;
            currentJumpHeight -= 3;
        }
    }
    else {
        currentJumpHeight = 0;
    }

    pipeDetection();
    ditchDetection();
    brickDetection();

    if (ditchDetected) {
        gameOver();
        cancelAnimationFrame();
    }

    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
    else if (e.keyCode == 32) {
        //currentJumpHeight = 10;
        jumping = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function onClick(e) {
    console.log(e);
}

document.addEventListener("click", onClick, false);
draw();