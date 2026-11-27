const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 960;
const HEIGHT = 600;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const audio = { ctx: null, muted: false, lastDig: 0 };

function playSound(name) {
    if (audio.muted) return;

    try {
        audio.ctx = audio.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const a = audio.ctx;
        if (a.state === "suspended") a.resume();

        const now = a.currentTime;

        const tone = (freq, start, length, type = "sine", volume = 0.12) => {
            const osc = a.createOscillator();
            const gain = a.createGain();

            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(volume, now + start);
            gain.gain.exponentialRampToValueAtTime(0.001, now + start + length);

            osc.connect(gain);
            gain.connect(a.destination);
            osc.start(now + start);
            osc.stop(now + start + length);
        }

        if (name === "dig") {
            if (performance.now() - audio.lastDig < 70) return;
            audio.lastDig = performance.now();

            const length = Math.floor(a.sampleRate * 0.06);
            const buffer = a.createBuffer(1, length, a.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / length);
            }

            const source = a.createBufferSource();
            const filter = a.createBiquadFilter();
            const gain = a.createGain();

            source.buffer = buffer;
            filter.type = "lowpass";
            filter.frequency.value = 900;
            gain.gain.value = 0.15;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(a.destination);
            source.start(now);
        }
        else if (name === "release") {
            tone(300, 0, 0.15);
            tone(450, 0.1, 0.2);
        }
        else if (name === "win") {
            [523, 659, 784, 1047].forEach((freq, i) => {
                tone(freq, i * 0.12, 0.3, "triangle");
            });
        }
        else if (name === "fail") {
            tone(220, 0, 0.3, "sawtooth", 0.08);
            tone(165, 0.25, 0.5, "sawtooth", 0.08);
        }
    } catch (error) {
    }
}

function update() {
    updateDigging();
    updateWater();
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawWorld(ctx, WIDTH, HEIGHT);
    drawDigging(ctx);
    drawWater(ctx);
}

const STEP = 1000 / 60;
let lastTime = 0;
let accumulator = 0;

function gameLoop(time) {
    if (!lastTime) lastTime = time;
    accumulator += Math.min(time - lastTime, 100);
    lastTime = time;

    while (accumulator >= STEP) {
        update();
        accumulator -= STEP;
    }

    draw();

    requestAnimationFrame(gameLoop);
}

function restartGame() {
    resetDigging();
    resetWater();
    updateLevelUI();
}

document.getElementById("startBtn").addEventListener("click", () => {
    releaseWater();
})

document.getElementById("restartBtn").addEventListener("click", () => {
    restartGame();
})

window.addEventListener("load", () => requestAnimationFrame(gameLoop));