
let soilArtCanvas = null;
let soilRenderCanvas = null;

function createRandom(seed) {
    return function () {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    }
}

function initializeSoilArt() {
    soilArtCanvas = document.createElement("canvas");
    soilArtCanvas.width = WIDTH;
    soilArtCanvas.height = HEIGHT;

    soilRenderCanvas = document.createElement("canvas");
    soilRenderCanvas.width = WIDTH;
    soilRenderCanvas.height = HEIGHT;

    const s = soilArtCanvas.getContext("2d");
    const random = createRandom(12345);

    s.fillStyle = "#c99d70";
    s.fillRect(0, 0, WIDTH, HEIGHT);

    s.fillStyle = "#b9875f";
    s.beginPath();
    s.moveTo(0, 195);
    s.quadraticCurveTo(240, 185, 430, 205);
    s.quadraticCurveTo(680, 225, 960, 190);
    s.lineTo(960, 600);
    s.lineTo(0, 600);
    s.closePath();
    s.fill();

    s.fillStyle = "#a87550";
    s.beginPath();
    s.moveTo(0, 440);
    s.quadraticCurveTo(260, 415, 490, 450);
    s.quadraticCurveTo(730, 480, 960, 435);
    s.lineTo(960, 600);
    s.lineTo(0, 600);
    s.closePath();
    s.fill();

    for (let i = 0; i < 450; i++) {
        const x = random() * WIDTH;
        const y = 165 + random() * 425;
        const radius = 1 + random() * 2.5;

        s.fillStyle = random() > 0.5
            ? "#8d6046"
            : "#e0b88c";

        s.globalAlpha = 0.35;
        s.beginPath();
        s.arc(x, y, radius, 0, Math.PI * 2);
        s.fill();
    }

    s.globalAlpha = 1;
}

function drawBackground(ctx) {
    ctx.fillStyle = "#c99d70";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Distant hills
    ctx.fillStyle = "#b5cda5";
    ctx.beginPath();
    ctx.moveTo(0, 145);
    ctx.quadraticCurveTo(180, 70, 350, 140);
    ctx.quadraticCurveTo(550, 55, 730, 135);
    ctx.quadraticCurveTo(850, 80, 960, 130);
    ctx.lineTo(960, 200);
    ctx.lineTo(0, 200);
    ctx.fill();
}
function drawGrass(ctx) {
    ctx.fillStyle = "#78985d";
    ctx.beginPath();
    ctx.moveTo(0, 145);
    ctx.quadraticCurveTo(180, 135, 350, 148);
    ctx.quadraticCurveTo(600, 158, 780, 142);
    ctx.quadraticCurveTo(880, 135, 960, 145);
    ctx.lineTo(960, 170);
    ctx.lineTo(0, 170);
    ctx.closePath();
    ctx.fill();

    const random = createRandom(54321);
    ctx.strokeStyle = "#527d4b";
    ctx.lineWidth = 2;

    for (let i = 0; i < 100; i++) {
        const x = random() * WIDTH;
        const y = 145 + random() * 8;

        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x - 3, y - 4 - random() * 7);
        ctx.stroke();
    }
}

function drawWorld(ctx, width, height) {
    if (!soilArtCanvas) {
        initializeSoilArt();
    }

    ctx.fillStyle = "#626b68";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "#4e5754";
    ctx.lineWidth = 2;

    for (let y = 80; y < HEIGHT; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    for (let x = 0; x < WIDTH; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    const soilCtx = soilRenderCanvas.getContext("2d");

    soilCtx.clearRect(0, 0, WIDTH, HEIGHT);
    soilCtx.drawImage(soilArtCanvas, 0, 0);

    soilCtx.globalCompositeOperation = "destination-in";
    soilCtx.drawImage(digging.terrainCanvas, 0, 0);
    soilCtx.globalCompositeOperation = "source-over";

    ctx.drawImage(soilRenderCanvas, 0, 0);

    drawWashroom(ctx);
    drawWaterSource(ctx);
}

function drawWaterSource(ctx) {
    // Underground pipe
    ctx.fillStyle = "#777b7d";
    ctx.strokeStyle = "#45494b";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.roundRect(20, 150, 145, 30, 7);
    ctx.fill();
    ctx.stroke();

    // Water visible inside the pipe
    ctx.fillStyle = "#48bfe0";
    ctx.fillRect(28, 157, 126, 16);

    // Pipe outlet
    ctx.fillStyle = "#353b3d";
    ctx.beginPath();
    ctx.ellipse(165, 165, 5, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#514332";
    ctx.font = "bold 14px Nunito";
    ctx.textAlign = "center";
    ctx.fillText("WATER PIPE", 90, 135);
}


function drawWashroom(ctx) {
    ctx.fillStyle = "#777777";
    ctx.fillRect(805, 450, 155, 150);

    ctx.fillStyle = "#e7dfcb";
    ctx.fillRect(817, 462, 143, 123);

    ctx.fillStyle = "#b7aa91";
    ctx.fillRect(817, 585, 143, 15);

    ctx.fillStyle = "#eee8d6";
    ctx.strokeStyle = "#786b59";
    ctx.lineWidth = 4

    ctx.beginPath();
    ctx.moveTo(845, 535);
    ctx.lineTo(852, 572)
    ctx.quadraticCurveTo(880, 585, 908, 572);
    ctx.lineTo(915, 535)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#d5cbb7";
    ctx.beginPath();
    ctx.ellipse(880, 535, 40, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#72c6d6";
    ctx.beginPath();
    ctx.ellipse(880, 537, 31, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    drawShowerPipe(ctx);
}


function drawShowerPipe(ctx) {
    ctx.strokeStyle = "#777b7d";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(885, 440);
    ctx.lineTo(885, 502);
    ctx.stroke();

    // Metallic highlight
    ctx.strokeStyle = "#c5c9ca";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(883, 445);
    ctx.lineTo(883, 498);
    ctx.stroke();

    // Showerhead
    ctx.fillStyle = "#656b6d";
    ctx.beginPath();
    ctx.roundRect(873, 500, 25, 9, 4);
    ctx.fill();

    // Shower holes
    ctx.fillStyle = "#45494b";

    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(878 + i * 5, 507, 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
}

