var canvas = document.getElementById("canvas");

var ctx = canvas.getContext('2d');

var radius = 300;
var centreX = canvas.width / 2;
var centreY = canvas.height / 2;

var div=8;

var deg = 2*Math.PI / div;


var ct=0;

var currentColor='black';

var prevPoint = {x: centreX, y: centreY};

console.log(centreX, centreY);

function getDist(x, y) {
    var a = x - centreX;
    var b = y - centreY;

    var c = Math.sqrt(a * a + b * b);
    return c;
}

function drawPoint(x, y) {
    ctx.moveTo(prevPoint.x, prevPoint.y);
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

    drawPoint(x, y);
    var sdeg,cdeg;
    for(var i=1;i<div;i++){
        sdeg = Math.sin(deg);
        cdeg = Math.cos(deg);
        ctx.transform(cdeg, sdeg, -sdeg, cdeg, (1 - cdeg) * centreX + sdeg * centreY, -sdeg * centreX + (1 - cdeg) * centreY);
        drawPoint(x, y);
    }

    ctx.transform(cdeg, sdeg, -sdeg, cdeg, (1 - cdeg) * centreX + sdeg * centreY, -sdeg * centreX + (1 - cdeg) * centreY);


    prevPoint = {x: x, y: y};
}

function draw(e, theta) {
    draw72(e, theta);
}

document.onmousemove = function (e) {
    if(e.buttons==0 || e.clientX<100 || e.clientY<100) return;

    ctx.beginPath();
    ctx.strokeStyle = currentColor;

    var theta = Math.atan((e.clientY - centreY) / (e.clientX - centreX));
    //console.log(e);
    //console.log(theta);
    //if (theta <= deg && theta >= 0) {
        draw(e, theta);
    //}

    ctx.closePath();

}

document.onmousedown = function(e){
    prevPoint = {x: e.clientX, y: e.clientY};
    currentColor = document.getElementById("color").value;
    div = document.getElementById("divs").value;
    deg = 2*Math.PI / div;
    console.log(currentColor,div);
}

