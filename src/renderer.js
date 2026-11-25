function drawWorld(ctx, width, height) {
    // Background
    ctx.fillStyle = "#dce8d0";
    ctx.fillRect(0, 0, width, height);

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

    ctx.fillStyle = "#bd9368";
    ctx.fillRect(0, 150, width, 450);

    ctx.fillStyle = "#c99d70";
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(width, 150);
    ctx.lineTo(width, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#b9875f";
    ctx.beginPath();
    ctx.moveTo(0, 195);
    ctx.quadraticCurveTo(240, 185, 430, 205);
    ctx.quadraticCurveTo(680, 225, 960, 190);
    ctx.lineTo(960, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#a87550";
    ctx.beginPath();
    ctx.moveTo(0, 440);
    ctx.quadraticCurveTo(260, 415, 490, 450);
    ctx.quadraticCurveTo(730, 480, 960, 435);
    ctx.lineTo(960, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    let seed = 12345;

    function random() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < 450; i++) {
        const x = random() * width;
        const y = 165 + random() * 425;
        const radius = 1 + random() * 2.5;

        ctx.fillStyle = random() > 0.5
            ? "#8d6046"
            : "#e0b88c";

        ctx.globalAlpha = 0.35;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    for (let i = 0; i < 24; i++) {
        const x = 25 + random() * 910;
        const y = 220 + random() * 340;
        const size = 5 + random() * 13;

        ctx.fillStyle = "#806f62";
        ctx.strokeStyle = "#665448";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x - size * 0.5, y - size * 0.8);
        ctx.lineTo(x + size * 0.6, y - size * 0.7);
        ctx.lineTo(x + size, y + size * 0.2);
        ctx.lineTo(x + size * 0.3, y + size * 0.8);
        ctx.lineTo(x - size * 0.7, y + size * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

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

    ctx.strokeStyle = "#527d4b";
    ctx.lineWidth = 2;

    for (let i = 0; i < 100; i++) {
        const x = random() * width;
        const y = 145 + random() * 8;

        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x - 3, y - 4 - random() * 7);
        ctx.stroke();
    }

    drawWaterSource(ctx);
    drawBathtub(ctx);
}

function drawWaterSource(ctx) {
    ctx.fillStyle = "#795d42";
    ctx.fillRect(105, 65, 12, 85);
    ctx.fillRect(190, 65, 12, 85);

    ctx.fillStyle = "#e5d8b8";
    ctx.strokeStyle = "#6d5942";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.roundRect(95, 35, 115, 100, 12);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(100, 40, 105, 90, 8);
    ctx.clip();

    ctx.fillStyle = "#58b6ce";
    ctx.fillRect(100, 75, 105, 55);

    ctx.fillStyle = "#8bd7e4";
    ctx.beginPath();
    ctx.ellipse(152, 76, 52, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = "#8b7558";
    ctx.fillRect(142, 130, 20, 24);
    ctx.fillRect(147, 145, 10, 16);

    ctx.fillStyle = "#5b4937";
    ctx.font = "bold 15px Nunito";
    ctx.textAlign = "center";
    ctx.fillText("WATER", 152, 25);
}

function drawBathtub(ctx) {
    ctx.fillStyle = "#795d42";
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.ellipse(780, 536, 105, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#eee8d6";
    ctx.strokeStyle = "#786b59";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(685, 465);
    ctx.lineTo(705, 530);
    ctx.quadraticCurveTo(780, 555, 855, 530);
    ctx.lineTo(875, 465);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#d5cbb7";
    ctx.beginPath();
    ctx.ellipse(780, 465, 95, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#72c6d6";
    ctx.beginPath();
    ctx.ellipse(780, 470, 75, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#786b59";
    ctx.fillRect(710, 530, 13, 22);
    ctx.fillRect(837, 530, 13, 22);

    ctx.fillStyle = "#655443";
    ctx.font = "bold 16px Nunito";
    ctx.textAlign = "center";
    ctx.fillText("YOUR BATHTUB", 780, 580);
}