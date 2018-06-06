var canvas = document.getElementById("canvas");

var ctx = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();

var radius = 300;
var centreX = canvas.width / 2;
var centreY = canvas.height / 2;

var div = 8;

var deg = 2 * Math.PI / div;

var currentColor = 'black';

var prevPoint = {x: centreX, y: centreY};

console.log(centreX, centreY);

function getDist(x, y) {
    var a = x - centreX;
    var b = y - centreY;

    var c = Math.sqrt(a * a + b * b);
    return c;
}

function drawPoint(x, y, theta) {
    ctx.moveTo(prevPoint.x, prevPoint.y);
    //ctx.quadraticCurveTo((prevPoint.x+x)/2,(prevPoint.y+y)/2,x+1,y+1);
    ctx.lineTo(x + 1, y + 1);
    ctx.stroke();
}

function draw72(e, theta) {
    var dist = getDist(e.clientX, e.clientY);
    //console.log(dist);
    if (dist > radius) {
        dist = radius;
    }

    var x = centreX + dist * Math.cos(theta);
    var y = centreY + dist * Math.sin(theta);
    ctx.save();
    drawPoint(x, y);
    var sdeg, cdeg;
    for (var i = 1; i < div; i++) {
        sdeg = Math.sin(deg);
        cdeg = Math.cos(deg);
        ctx.transform(cdeg, sdeg, -sdeg, cdeg, (1 - cdeg) * centreX + sdeg * centreY, -sdeg * centreX + (1 - cdeg) * centreY);
        drawPoint(x, y, theta);
    }

    ctx.transform(cdeg, sdeg, -sdeg, cdeg, (1 - cdeg) * centreX + sdeg * centreY, -sdeg * centreX + (1 - cdeg) * centreY);

    ctx.restore();

    prevPoint = {x: x, y: y};
}

function draw(e, theta) {
    draw72(e, theta);
}

document.onmousemove = function (e) {
    if (e.buttons == 0 || e.clientX < rect.x || e.clientY < rect.y) return;

    ctx.beginPath();
    ctx.strokeStyle = currentColor;

    var m = {
        clientX: e.clientX - rect.x,
        clientY: e.clientY - rect.top
    };
    console.log(m);
    var theta = Math.atan((e.clientY - centreY) / (e.clientX - centreX));
    draw(m, theta);

    ctx.closePath();

}

document.onmousedown = function (e) {

    prevPoint = {x: e.clientX, y: e.clientY};
    currentColor = document.getElementById("color").value;
    div = document.getElementById("divs").value;
    deg = 2 * Math.PI / div;
    radius = document.getElementById("radius").value;

    console.log(e);
}

function reset() {
    ctx.fillStyle = document.getElementById("bg-color").value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.body.style.backgroundColor = document.getElementById("bg-color").value;
}