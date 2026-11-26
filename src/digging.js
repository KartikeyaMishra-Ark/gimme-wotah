const digging = {
    radius: 18,
    isDrawing: false,
    terrainCanvas: document.createElement("canvas"),
    terrainCtx: null,
    protectedCanvas: document.createElement("canvas"),
    protectedCtx: null,
    holes: [],
    lastPoint: null
};

digging.terrainCanvas.width = WIDTH;
digging.terrainCanvas.height = HEIGHT;
digging.terrainCtx = digging.terrainCanvas.getContext("2d");
digging.protectedCanvas.width = WIDTH;
digging.protectedCanvas.height = HEIGHT;
digging.protectedCtx = digging.protectedCanvas.getContext("2d");

function initializeTerrain() {
    const t = digging.terrainCtx;



    t.clearRect(0, 0, WIDTH, HEIGHT);

    t.fillStyle = "#ffffff";
    t.fillRect(0, 0, WIDTH, HEIGHT);
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
    const p = digging.protectedCtx;

    const radius = digging.radius;

    const area = document.createElement("canvas");
    area.width = radius * 2 + 2;
    area.height = radius * 2 + 2;

    const a = area.getContext("2d");

    a.drawImage(
        digging.terrainCanvas,
        x - radius - 1,
        y - radius - 1,
        area.width,
        area.height,
        0,
        0,
        area.width,
        area.height
    )

    a.globalCompositeOperation = "destination-out";

    a.beginPath();
    a.arc(radius + 1, radius + 1, radius, 0, Math.PI * 2);
    a.fill();

    a.globalCompositeOperation = "destination-in";

    a.drawImage(
        digging.protectedCanvas,
        x - radius - 1,
        y - radius - 1,
        area.width,
        area.height,
        0,
        0,
        area.width,
        area.height
    )

    t.clearRect(
        x - radius - 1,
        y - radius - 1,
        area.width,
        area.height
    )

    t.drawImage(area, x - radius - 1, y - radius - 1);
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
function initializeProtectedTerrain() {
    const p = digging.protectedCtx;

    p.clearRect(0, 0, WIDTH, HEIGHT);

    p.fillStyle = "#ffffff";
    p.fillRect(0, 0, WIDTH, 145);
    p.fillRect(0, 0, 15, HEIGHT);
    p.fillRect(945, 0, 15, HEIGHT);
    p.fillRect(0, 585, WIDTH, 15);

    p.fillRect(805, 450, 155, 150);
}

canvas.addEventListener("pointerdown", startDigging);
canvas.addEventListener("pointermove", continueDigging);
canvas.addEventListener("pointerup", stopDigging);
canvas.addEventListener("pointercancel", stopDigging);

initializeTerrain();
initializeProtectedTerrain();