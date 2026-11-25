
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 960;
const HEIGHT = 600;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function update() {
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawWorld(ctx, WIDTH, HEIGHT);
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
