
const digging = {
    radius: 18,
    isDrawing: false,
    terrainCanvas: document.createElement("canvas"),
    terrainCtx: null,
    holes: [],
    lastPoint: null
};

digging.terrainCanvas.width = WIDTH;
digging.terrainCanvas.height = HEIGHT;
digging.terrainCtx = digging.terrainCanvas.getContext("2d");

function initializeTerrain() {
    const t = digging.terrainCtx;

    t.clearRect(0, 0, WIDTH, HEIGHT);

    t.fillStyle = "#ffffff";
    t.fillRect(0, 150, WIDTH, HEIGHT - 150);

    t.globalCompositeOperation = "destination-out";
    t.fillRect(145, 155, 30, 25);

    t.globalCompositeOperation = "source-over";
}

function getCanvasPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * WIDTH / rect.width,
        y: (event.clientY - rect.top) * HEIGHT / rect.height
    };
}

function digAt(x, y) {
    const t = digging.terrainCtx;

    t.save();
    t.globalCompositeOperation = "destination-out";
    t.beginPath();
    t.arc(x, y, digging.radius, 0, Math.PI * 2);
    t.fill();
    t.restore();
}

function startDigging(event) {
    if (event.button !== 0) return;

    event.preventDefault();

    digging.isDrawing = true;
    digging.lastPoint = getCanvasPosition(event);

    digAt(digging.lastPoint.x, digging.lastPoint.y);

    canvas.setPointerCapture(event.pointerId);
}

function continueDigging(event) {
    if (!digging.isDrawing) return;

    event.preventDefault();

    const point = getCanvasPosition(event);

    const dx = point.x - digging.lastPoint.x;
    const dy = point.y - digging.lastPoint.y;

    const distance = Math.hypot(dx, dy);
    const spacing = digging.radius * 0.4;
    const steps = Math.max(1, Math.ceil(distance / spacing));

    for (let i = 1; i <= steps; i++) {
        const t = i / steps;

        digAt(
            digging.lastPoint.x + dx * t,
            digging.lastPoint.y + dy * t
        );
    }

    digging.lastPoint = point;
}

function stopDigging() {
    digging.isDrawing = false;
    digging.lastPoint = null;
}

function drawDigging(ctx) {

}

function resetDigging() {
    initializeTerrain();
    stopDigging();
}

canvas.addEventListener("pointerdown", startDigging);
canvas.addEventListener("pointermove", continueDigging);
canvas.addEventListener("pointerup", stopDigging);
canvas.addEventListener("pointercancel", stopDigging);

initializeTerrain();
