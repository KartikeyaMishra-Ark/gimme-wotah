
const rocks = [];

function createRock(x, y, radius = 11) {
    rocks.push({
        x,
        y,
        radius,
        type: "rock"
    })
}

function createRockLine(x1, y1, x2, y2, radius = 11) {
    const length = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.ceil(length / 18));

    for (let i = 0; i <= steps; i++) {
        createRock(
            x1 + (x2 - x1) * i / steps,
            y1 + (y2 - y1) * i / steps,
            radius
        )
    }
}

function initializeLevelRocks() {
    rocks.length = 0;

    for (let x = 810; x <= 950; x += 18) {
        createRock(x, 450); 
    }

    for (let x = 810; x <= 950; x += 18) {
        createRock(x, 595);
    }

    for (let y = 468; y <= 585; y += 18) {
        createRock(805, y);
        createRock(955, y)
    }

    for (const [x1, y1, x2, y2] of getLevel().rocks) {
        createRockLine(x1, y1, x2, y2);
    }

}

function drawRocks(ctx) {
    for (const rock of rocks) {
        const { x, y, radius } = rock;

        ctx.fillStyle = "#716c62";
        ctx.strokeStyle = "#494740";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#999184"
        ctx.beginPath();
        ctx.arc(
            x - radius * 0.3,
            y - radius * 0.3,
            radius * 0.25,
            0,
            Math.PI * 2
        )
        ctx.fill();
    }
}
