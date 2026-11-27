const digging = {
    radius: 18,
    isDrawing: false,
    terrainCanvas: document.createElement("canvas"),
    terrainCtx: null,
    digMaskCanvas: document.createElement("canvas"),
    digMaskCtx: null,
    protectedCanvas: document.createElement("canvas"),
    protectedCtx: null,
    holes: [],
    lastPoint: null,
    inkMax: Infinity,
    inkUsed: 0,
    pixels: null,
    dirtyRect: null,
    protectedPixels: null,
    crumbs: []
}
digging.terrainCtx = digging.terrainCanvas.getContext("2d", { willReadFrequently: true });

digging.terrainCanvas.width = WIDTH;
digging.terrainCanvas.height = HEIGHT;
digging.terrainCtx = digging.terrainCanvas.getContext("2d");
digging.digMaskCanvas.width = WIDTH;
digging.digMaskCanvas.height = HEIGHT;
digging.digMaskCtx = digging.digMaskCanvas.getContext("2d");
digging.protectedCanvas.width = WIDTH;
digging.protectedCanvas.height = HEIGHT;
digging.protectedCtx = digging.protectedCanvas.getContext("2d");

function initializeTerrain() {
    const t = digging.terrainCtx;



    t.clearRect(0, 0, WIDTH, HEIGHT);

    t.fillStyle = "#ffffff";
    t.fillRect(0, 0, WIDTH, HEIGHT);
    t.globalCompositeOperation = "destination-out";
    t.fillRect(145, getLevel().sourceY - 10, 30, 25);

    t.globalCompositeOperation = "source-over";

    digging.pixels = null;
    digging.dirtyRect = null;
}

function getCanvasPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * WIDTH / rect.width,
        y: (event.clientY - rect.top) * HEIGHT / rect.height
    };
}


function markTerrainDirty(x0, y0, x1, y1) {
    const d = digging.dirtyRect;

    if (!d) {
        digging.dirtyRect = { x0, y0, x1, y1 };
        return;
    }

    d.x0 = Math.min(d.x0, x0);
    d.y0 = Math.min(d.y0, y0);
    d.x1 = Math.max(d.x1, x1);
    d.y1 = Math.max(d.y1, y1);
}

function getTerrainPixels() {
    if (!digging.pixels) {
        digging.pixels = digging.terrainCtx.getImageData(0, 0, WIDTH, HEIGHT).data;
        digging.dirtyRect = null;
    }
    else if (digging.dirtyRect) {
        const { x0, y0, x1, y1 } = digging.dirtyRect;
        const w = x1 - x0;
        const h = y1 - y0;
        const patch = digging.terrainCtx.getImageData(x0, y0, w, h).data;

        for (let row = 0; row < h; row++) {
            digging.pixels.set(
                patch.subarray(row * w * 4, (row + 1) * w * 4),
                ((y0 + row) * WIDTH + x0) * 4
            )
        }

        digging.dirtyRect = null;
    }

    return digging.pixels;
}

function isProtectedAt(x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    if (!digging.protectedPixels || px < 0 || px >= WIDTH || py < 0 || py >= HEIGHT) {
        return true;
    }

    return digging.protectedPixels[(py * WIDTH + px) * 4 + 3] > 0;
}

function spawnCrumbs(x, y) {
    if (
        digging.crumbs.length > 150 ||
        Math.random() > 0.35 ||
        isProtectedAt(x, y)
    ) {
        return;
    }

    const colors = ["#8d6046", "#e0b88c", "#b9875f"];

    digging.crumbs.push({
        x: x + (Math.random() - 0.5) * digging.radius,
        y: y + (Math.random() - 0.5) * digging.radius,
        vx: (Math.random() - 0.5) * 2,
        vy: -1 - Math.random() * 1.5,
        life: 25 + Math.random() * 15,
        size: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
    })
}

function updateDigging() {
    for (let i = digging.crumbs.length - 1; i >= 0; i--) {
        const crumb = digging.crumbs[i];

        crumb.vy += 0.2;
        crumb.x += crumb.vx;
        crumb.y += crumb.vy;
        crumb.life--;

        if (crumb.life <= 0) {
            digging.crumbs.splice(i, 1);
        }
    }
}


function digAt(x, y) {
    const mask = digging.digMaskCtx;
    const terrain = digging.terrainCtx;
    const radius = digging.radius;

    const x0 = Math.max(0, Math.floor(x - radius - 1));
    const y0 = Math.max(0, Math.floor(y - radius - 1));
    const x1 = Math.min(WIDTH, Math.ceil(x + radius + 1));
    const y1 = Math.min(HEIGHT, Math.ceil(y + radius + 1));
    const w = x1 - x0;
    const h = y1 - y0;

    if (w <= 0 || h <= 0) return;

    mask.clearRect(x0, y0, w, h);

    mask.fillStyle = "#ffffff";
    mask.beginPath();
    mask.arc(x, y, radius, 0, Math.PI * 2);
    mask.fill();

    mask.globalCompositeOperation = "destination-out";
    mask.drawImage(digging.protectedCanvas, x0, y0, w, h, x0, y0, w, h);
    mask.globalCompositeOperation = "source-over";

    terrain.globalCompositeOperation = "destination-out";
    terrain.drawImage(digging.digMaskCanvas, x0, y0, w, h, x0, y0, w, h);
    terrain.globalCompositeOperation = "source-over";

    markTerrainDirty(x0, y0, x1, y1);
    spawnCrumbs(x, y);
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
        if (digging.inkUsed >= digging.inkMax) break;
        digging.inkUsed += distance / steps;

        digAt(
            digging.lastPoint.x + dx * t,
            digging.lastPoint.y + dy * t
        );
    }

    if (digging.inkUsed < digging.inkMax) {
        playSound("dig");
    }

    digging.lastPoint = point;
}

function stopDigging() {
    digging.isDrawing = false;
    digging.lastPoint = null;
}

function drawDigging(ctx) {
    for (const crumb of digging.crumbs) {
        ctx.globalAlpha = Math.min(1, crumb.life / 10);
        ctx.fillStyle = crumb.color;
        ctx.fillRect(crumb.x, crumb.y, crumb.size, crumb.size);
    }

    ctx.globalAlpha = 1;

    if (digging.inkMax === Infinity) return;

    const meterX = 440;
    const meterY = 35;
    const meterWidth = 220;
    const meterHeight = 18;
    const left = Math.max(0, 1 - digging.inkUsed / digging.inkMax);

    ctx.fillStyle = "#514332";
    ctx.font = "bold 16px Nunito";
    ctx.textAlign = "left";
    ctx.fillText("DIGGING LEFT", meterX, meterY - 8);

    ctx.fillStyle = "#b9ad98";
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    ctx.fillStyle = left > 0.2 ? "#c99d70" : "#c0533a";
    ctx.fillRect(meterX, meterY, meterWidth * left, meterHeight);
}

function resetDigging() {
    initializeTerrain();
    initializeProtectedTerrain();
    stopDigging();
    digging.inkUsed = 0;
    digging.inkMax = getLevel().ink || Infinity;
    digging.crumbs.length = 0;
}
function initializeProtectedTerrain() {
    const p = digging.protectedCtx;
    const t = digging.terrainCtx

    p.clearRect(0, 0, WIDTH, HEIGHT);

    p.fillStyle = "#ffffff";
    p.fillRect(0, 0, WIDTH, 145);
    p.fillRect(0, 0, 15, HEIGHT);
    p.fillRect(945, 0, 15, HEIGHT);
    p.fillRect(0, 585, WIDTH, 15);

    for (const rock of rocks) {
        p.beginPath();
        p.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2);
        p.fill();

        t.beginPath();
        t.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2);
        t.fill();
    }

    digging.protectedPixels = p.getImageData(0, 0, WIDTH, HEIGHT).data;
    digging.pixels = null;
}
