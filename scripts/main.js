const FPS = 24;

var darkMode = false;
var canvas;
var ctx;

var anchor = [0, 0];
var xRange = 20;
var tick;

// by 0.2 (split 4)
// by 0.5
// 4 by 1
// 8: by 2 (split 4)
// 16: by 5
// 32: by 10
// 64: by 20 (split 4)
// 150: by 50
// 300: by 100
// 600: by 200 (split 4)
const ticks = [1, 2, 5];
function drawGrid() {
    // debugger;
    let yRange = xRange * (canvas.height / canvas.width);
    let origin = coords_to_pixel([0, 0]);
    ctx.fillRect(origin[0] - 2, 0, 5, canvas.height);
    ctx.fillRect(0, origin[1] - 2, canvas.width, 5);
    
    let majorTickSpacing = ticks[Math.floor(Math.log10(xRange) % 1 * 3)] * Math.floor(Math.log10(xRange));
    let minorTicks = Math.floor(Math.log10(xRange) % 1 * 3) == 1 ? 4 : 5;
    let minorTickSpacing = majorTickSpacing / minorTicks;
    
    let firstX = Math.floor((anchor[0] - xRange / 2) / majorTickSpacing) * majorTickSpacing;
    let firstY = Math.floor((anchor[1] - yRange / 2) / majorTickSpacing) * majorTickSpacing;
    let firstPixel = coords_to_pixel([firstX, firstY]);
    let majorTickSpacingPixels = majorTickSpacing / xRange * canvas.width;
    for (var i = 0; i < xRange / majorTickSpacing; i++) {
        let x = firstPixel[0] + majorTickSpacingPixels * i;
        ctx.fillRect(x - 1, 0, 3, canvas.height);
        for (var j = 0; j < minorTicks; j++) {
            let x1 = x + (j / minorTicks) * majorTickSpacingPixels;
            ctx.fillRect(x1, 0, 1, canvas.height);
        }
    }
    for (var i = 0; i < Math.ceil(yRange / majorTickSpacing); i++) {
        let y = firstPixel[1] - majorTickSpacingPixels * i;
        ctx.fillRect(0, y - 1, canvas.width, 3);
        for (var j = 0; j < minorTicks; j++) {
            let y1 = y + (j / minorTicks) * majorTickSpacingPixels;
            ctx.fillRect(0, y1, canvas.width, 1);
        }
    }
}

function pixel_to_coords(pixel) {
    let yRange = xRange * (canvas.height / canvas.width);
    return [(pixel[0] / canvas.width) * xRange + (anchor[0] - xRange / 2), 
            (1 - pixel[1] / canvas.height) * yRange + (anchor[1] - yRange / 2)];
}

function coords_to_pixel(coords) {
    let yRange = xRange * (canvas.height / canvas.width);
    return [(coords[0] - anchor[0] + xRange / 2) / xRange * canvas.width,
            (1 - (coords[1] - anchor[1] + yRange / 2) / yRange) * canvas.height];
}

function zoom(n) {
    xRange *= Math.pow(1.25, n / 100);
}

function reset() {
    xRange = 20;
    anchor = [0, 0];
}

window.onload = function() {
    darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e) {
        darkMode = e.matches;
    });
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    window.addEventListener("resize", function(e) {
        console.log("woah there");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");
    });

    window.addEventListener("wheel", function(e) {
        zoom(e.deltaY);
    });

    tick();
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = darkMode ? "white" : "black";

    drawGrid();

    window.setTimeout(() => {
        tick();
    }, 1000 / FPS);
}