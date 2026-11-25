
const water = {
    particles: [],
    spawnTimer: 0,
    maxParticles: 180,
    released: false,
    collected: 0
};

function releaseWater() {
    water.released = true;
}

function resetWater() {
    water.particles = [];
    water.spawnTimer = 0;
    water.released = false;
    water.collected = 0;
}

function isSolidAt(x, y, pixels) {
    const samples = [
        [x, y],
        [x - 2, y],
        [x + 2, y],
        [x, y - 2],
        [x, y + 2]
    ];

    for (const [sampleX, sampleY] of samples) {
        const px = Math.floor(sampleX);
        const py = Math.floor(sampleY);

        if (px < 0 || px >= WIDTH || py < 0 || py >= HEIGHT) {
            return true;
        }

        const index = (py * WIDTH + px) * 4;

        if (pixels[index + 3] > 0) {
            return true;
        }
    }

    return false;
}

function isInsideBathtub(x, y) {
    return (
        x >= 725 &&
        x <= 875 &&
        y >= 440 &&
        y <= 505
    );
}

function updateWater() {
    const terrain = digging.terrainCtx.getImageData(
        0, 0, WIDTH, HEIGHT
    );

    const pixels = terrain.data;

    if (water.released) {
        water.spawnTimer++;

        if (
            water.spawnTimer >= 3 &&
            water.particles.length < water.maxParticles
        ) {
            water.spawnTimer = 0;

            water.particles.push({
                x: 165 + Math.random() * 3,
                y: 165,
                vx: 0,
                vy: 1.2 + Math.random(),
                radius: 3
            })
        }
    }

    for (let i = water.particles.length - 1; i >= 0; i--) {
        const particle = water.particles[i];

        particle.vy = Math.min(particle.vy + 0.16, 3.5);

        const nextX = particle.x + particle.vx;
        const nextY = particle.y + particle.vy;

        if (isInsideBathtub(nextX, nextY)) {
            water.collected++;
            water.particles.splice(i, 1);
            continue;
        }

        if (!isSolidAt(nextX, nextY, pixels)) {
            particle.x = nextX;
            particle.y = nextY;
            continue;
        }

        const directions = Math.random() > 0.5
            ? [-1, 1]
            : [1, -1];

        let moved = false;

        for (const direction of directions) {
            const sideX = particle.x + direction * 3;
            const sideY = particle.y + 2;

            if (!isSolidAt(sideX, sideY, pixels)) {
                particle.x = sideX;
                particle.y = sideY;
                particle.vy = 0.5;
                particle.vx = direction * 0.3;
                moved = true;
                break;
            }
        }

        if (moved) continue;

        for (const direction of directions) {
            const sideX = particle.x + direction * 3;

            if (!isSolidAt(sideX, particle.y, pixels)) {
                particle.x = sideX;
                particle.vx = direction * 0.3;
                particle.vy = 0;
                moved = true;
                break;
            }
        }

        if (!moved) {
            particle.vx = 0;
            particle.vy = 0;
        }
    }
}

function drawWater(ctx) {
    ctx.fillStyle = "#48bfe0";

    for (const particle of water.particles) {
        ctx.beginPath();
        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        )
        ctx.fill();
    }
}
