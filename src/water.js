
const water = {
    particles: [],
    spawnTimer: 0,
    maxParticles: 180,
    released: false,
    collected: 0,

    gravity: 0.13,
    maxSpeed: 3.5,
    spacing: 5.5,
    interactionRadius: 13,
    target: 80,
    completed: false

};

function releaseWater() {
    water.released = true;
}

function resetWater() {
    water.particles = [];
    water.spawnTimer = 0;
    water.released = false;
    water.collected = 0;
    water.completed = false;
}

function isSolidAt(x, y, pixels) {
    const samples = [
        [0, 0],
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ];

    for (const [offsetX, offsetY] of samples) {
        const px = Math.floor(x + offsetX);
        const py = Math.floor(y + offsetY);

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

function spawnWater() {
    water.spawnTimer++;

    if (
        water.spawnTimer >= 2 &&
        water.particles.length < water.maxParticles
    ) {
        water.spawnTimer = 0;

        water.particles.push({
            x: 165 + Math.random() * 3,
            y: 165,
            vx: (Math.random() - 0.5) * 0.15,
            vy: 1,
            radius: 3
        });
    }
}

function applyParticleInteractions() {
    const particles = water.particles;
    const forces = particles.map(() => ({ x: 0, y: 0 }));

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distanceSquared = dx * dx + dy * dy;
            const distance = Math.sqrt(distanceSquared);

            if (
                distance === 0 ||
                distance > water.interactionRadius
            ) {
                continue;
            }

            const nx = dx / distance;
            const ny = dy / distance;

            if (distance < water.spacing) {
                const strength = (water.spacing - distance) * 0.035;

                forces[i].x -= nx * strength;
                forces[i].y -= ny * strength;

                forces[j].x += nx * strength;
                forces[j].y += ny * strength;
            }

            else if (distance > 7) {
                const strength = (distance - 7) * 0.0008;

                forces[i].x += nx * strength;
                forces[i].y += ny * strength;

                forces[j].x -= nx * strength;
                forces[j].y -= ny * strength;
            }

            const velocityX = (b.vx - a.vx) * 0.012;
            const velocityY = (b.vy - a.vy) * 0.012;

            forces[i].x += velocityX;
            forces[i].y += velocityY;

            forces[j].x -= velocityX;
            forces[j].y -= velocityY;
        }
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].vx += forces[i].x;
        particles[i].vy += forces[i].y;
    }
}

function moveParticle(particle, pixels) {
    particle.vy = Math.min(
        particle.vy + water.gravity,
        water.maxSpeed
    );

    particle.vx *= 0.985;

    const nextX = particle.x + particle.vx;
    const nextY = particle.y + particle.vy;

    if (isInsideBathtub(nextX, nextY)) {
        water.collected++;

        if (water.collected >= water.target) {
            water.completed = true;
        }

        return false;
    }

    if (!isSolidAt(nextX, nextY, pixels)) {
        particle.x = nextX;
        particle.y = nextY;
        return true;
    }

    const directions = Math.random() > 0.5
        ? [-1, 1]
        : [1, -1];

    for (const direction of directions) {
        const sideX = particle.x + direction * 3;
        const sideY = particle.y + 2;

        if (!isSolidAt(sideX, sideY, pixels)) {
            particle.x = sideX;
            particle.y = sideY;
            particle.vx += direction * 0.12;
            particle.vy *= 0.4;
            return true;
        }
    }

    for (const direction of directions) {
        const sideX = particle.x + direction * 3;

        if (!isSolidAt(sideX, particle.y, pixels)) {
            particle.x = sideX;
            particle.vx += direction * 0.08;
            particle.vy *= 0.2;
            return true;
        }
    }

    particle.vy *= 0.1;
    particle.vx *= 0.7;

    return true;
}

function updateWater() {
    if (water.released && !water.completed) {
        spawnWater();
    }

    const terrain = digging.terrainCtx.getImageData(
        0, 0, WIDTH, HEIGHT
    );

    const pixels = terrain.data;

    applyParticleInteractions();

    for (let i = water.particles.length - 1; i >= 0; i--) {
        const particle = water.particles[i];

        if (!moveParticle(particle, pixels)) {
            water.particles.splice(i, 1);
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

    const meterX = 700;
    const meterY = 35;
    const meterWidth = 220;
    const meterHeight = 18;
    const progress = Math.min(water.collected / water.target, 1);

    ctx.fillStyle = "#514332";
    ctx.font = "bold 16px Nunito";
    ctx.textAlign = "left";
    ctx.fillText(
        `WATER: ${water.collected} / ${water.target}`,
        meterX,
        meterY - 8
    )

    ctx.fillStyle = "#b9ad98";
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    ctx.fillStyle = "#48bfe0";
    ctx.fillRect(
        meterX,
        meterY,
        meterWidth * progress,
        meterHeight
    )

    if (water.completed) {
        ctx.fillStyle = "#514332";
        ctx.textAlign = "center";
        ctx.font = "900 42px Nunito";
        ctx.fillText("LEVEL COMPLETE!", WIDTH / 2, 90);

        ctx.font = "bold 20px Nunito";
        ctx.fillText("You got the wotah!", WIDTH / 2, 125);
    }
}