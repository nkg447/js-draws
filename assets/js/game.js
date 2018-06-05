var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.height = window.innerHeight - 100;
canvas.width = window.innerWidth - 100;

var relativeCanvas = {
    height: canvas.height - 50,
    width: canvas.width
}

var arrowImg = new Image();
arrowImg.src = "assets/img/live_arrow.png";

var arrow = {
    tail: 20,
    width: 200,
    height: 20,
    drawArrow: function (y) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(this.tail, y);
        ctx.lineTo(this.tail + this.width, y);
        ctx.moveTo(this.tail + this.width - this.height, y - this.height);
        ctx.lineTo(this.tail + this.width, y);
        ctx.lineTo(this.tail + this.width - this.height, y + this.height);
        ctx.moveTo(this.tail, y - this.height);
        ctx.lineTo(this.tail + this.height, y);
        ctx.lineTo(this.tail, y + this.height);
        ctx.stroke();
    }
}

var target = {
    centreX: canvas.width - 20,
    height: 150,
    rdiff: 30,
    width: 10,
    drawTarget: function (y) {
        this.drawBar(this.centreX - this.width, y, 0);
        this.drawBar(this.centreX - this.width * 2, y, this.rdiff);
        this.drawBar(this.centreX - this.width * 3, y, 2 * this.rdiff);
    },
    drawBar: function (x, y, r) {
        ctx.beginPath();
        ctx.arc(x + this.width / 2, y - this.height / 2 + r, this.width / 2, 0, Math.PI, true);
        ctx.fillRect(x, y - this.height / 2 + r, this.width, this.height - r * 2);
        ctx.arc(x + this.width / 2, y + this.height / 2 - r, this.width / 2, 0, Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }

}

var arrowPos = 30;
var arrowDownSpeed = 2;
var arrowSpeed = 20;
var arrowMovingDown = true;

var targetPos = 100;
var targetSpeed = 4;
var targetMovingDown = true;

var respawnTimer = 20;

var releaseArrow = false;
var score = 0;
var lives = 5;

function getScore() {
    if (arrowPos <= (targetPos + target.height / 2 - 2 * target.rdiff) && arrowPos >= (targetPos - target.height / 2 + 2 * target.rdiff))
        return 3;
    if (arrowPos <= (targetPos + target.height / 2 - target.rdiff) && arrowPos >= (targetPos - target.height / 2 + target.rdiff))
        return 2;
    if (arrowPos <= (targetPos + target.height / 2) && arrowPos >= (targetPos - target.height / 2))
        return 1;
    return 0;
}

function updateScore() {
    ctx.clearRect(0, relativeCanvas.height, relativeCanvas.width, canvas.height - relativeCanvas.height);
    ctx.font = "16px Arial";
    ctx.fillText("Score : " + score, canvas.width - 100, relativeCanvas.height + 50);
    ctx.fillText("Lives : " + lives, 10, relativeCanvas.height + 50);
}

function gameOver() {
    ctx.clearRect(0, 0, relativeCanvas.width, relativeCanvas.height);
    ctx.fillText("GAME OVER", 250, relativeCanvas.height + 50);
}

function gameLoop() {
    ctx.clearRect(0, 0, relativeCanvas.width, relativeCanvas.height);
    arrow.drawArrow(arrowPos);
    target.drawTarget(targetPos);

    //moving arrow
    if (releaseArrow) {
        arrow.tail += arrowSpeed;
        if (arrow.tail > relativeCanvas.width - arrow.width - 50) {
            arrowSpeed = 0;
            respawnTimer--;
            if (respawnTimer == 0) {
                arrow.tail = 20;
                releaseArrow = false;
                arrowSpeed = 20;
                respawnTimer = 20;
                score += getScore();
                console.log(score);
                lives--;
                updateScore();
                if (lives == 0) {
                    gameOver();
                    cancelAnimationFrame();
                }
            }
        }
    }
    else {
        if (arrowMovingDown) {
            arrowPos += arrowDownSpeed;
            if (arrowPos >= relativeCanvas.height - arrow.height * 2) {
                arrowMovingDown = false;
            }
        }
        else {
            arrowPos -= arrowDownSpeed;
            if (arrowPos <= arrow.height * 2) {
                arrowMovingDown = true;
            }
        }
    }

    //moving target
    if (respawnTimer == 20) {
        if (targetMovingDown) {
            targetPos += targetSpeed;
            if (targetPos >= relativeCanvas.height - target.height / 2 - 5) {
                targetMovingDown = false;
            }
        }
        else {
            targetPos -= targetSpeed;
            if (targetPos <= target.height / 2 - 5) {
                targetMovingDown = true;
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

document.onmousedown = function (e) {
    releaseArrow = true;
}
document.onkeydown = function (e) {
    if (e.keyCode == 32) {
        releaseArrow = true;
    }
}

updateScore();
gameLoop();