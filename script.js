const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

let drawing = false;
let erasing = false;
let startX, startY;
let history = [];

function startDrawing(e) {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
}

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = erasing ? 20 : 2;
    ctx.strokeStyle = erasing ? '#e6e6e6' : '#000';
    ctx.lineCap = 'round';
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function undo() {
    if (history.length > 0) {
        ctx.putImageData(history.pop(), 0, 0);
    }
}

function printCanvas() {
    const dataUrl = canvas.toDataURL();
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`<img src="${dataUrl}" />`);
}

document.getElementById('draw').addEventListener('click', () => {
    erasing = false;
    canvas.style.cursor = 'crosshair';
});

document.getElementById('erase').addEventListener('click', () => {
    erasing = true;
    canvas.style.cursor = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mJk+A/7fwsXBRZWTdgCpvh5FGyAAYoaJz0GhKsM8RyNY0A0u9pASmIBNRmgaR+gwA9GkgHAQMAEmsDg3Jf0zoAAAAASUVORK5CYII=), auto';
});

document.getElementById('undo').addEventListener('click', undo);

document.getElementById('print').addEventListener('click', printCanvas);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
