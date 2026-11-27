
const levels = [
    {
        name: "First Drip",
        sourceY: 165,
        target: 60,
        waterBudget: 400,
        par: 800,
        rocks: [],
        drains: []
    },
    {
        name: "Through the Gap",
        sourceY: 165,
        target: 70,
        waterBudget: 400,
        par: 800,
        ink: 2000,
        rocks: [
            [470, 190, 470, 330],
            [470, 420, 470, 585]
        ],
        drains: []
    },
    {
        name: "Mind the Sewer",
        sourceY: 200,
        target: 70,
        waterBudget: 230,
        par: 800,
        ink: 2100,
        rocks: [
            [300, 300, 300, 420]
        ],
        drains: [
            { x: 540, y: 350, w: 120, h: 90 }
        ]
    },
    {
        name: "Rocky Road",
        sourceY: 165,
        target: 80,
        waterBudget: 350,
        par: 900,
        ink: 2300,
        rocks: [
            [330, 300, 330, 585],
            [600, 145, 600, 340]
        ],
        drains: [
            { x: 380, y: 470, w: 150, h: 90 }
        ]
    }
];

const PROGRESS_KEY = "gimmeWotahProgress";
const progress = { unlocked: 1, stars: [] };
let currentLevelIndex = 0;

function getLevel() {
    return levels[currentLevelIndex];
}

function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));

        if (saved) {
            progress.unlocked = Math.min(saved.unlocked || 1, levels.length);
            progress.stars = saved.stars || [];
        }
    } catch (error) {
        // no saved progress, start fresh
    }
}

function saveProgress() {
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
        // saving is optional
    }
}

function buildLevelSelect() {
    const container = document.getElementById("levelSelect");

    levels.forEach((level, i) => {
        const button = document.createElement("button");

        button.className = "level-dot";
        button.title = level.name;

        button.addEventListener("click", () => {
            button.blur();

            if (i < progress.unlocked) {
                loadLevel(i);
            }
        });

        container.appendChild(button);
    });
}

function updateLevelUI() {
    const number = String(currentLevelIndex + 1).padStart(2, "0");

    document.getElementById("levelLabel").textContent =
        `LEVEL ${number} - ${getLevel().name.toUpperCase()}`;

    document.getElementById("nextBtn").hidden =
        !water.completed || currentLevelIndex + 1 >= levels.length;

    document.querySelectorAll("#levelSelect .level-dot").forEach((button, i) => {
        const stars = progress.stars[i] || 0;

        button.textContent = (i + 1) + (stars ? " " + "\u2605".repeat(stars) : "");
        button.disabled = i >= progress.unlocked;
        button.classList.toggle("active", i === currentLevelIndex);
    });
}

function loadLevel(index) {
    currentLevelIndex = index;

    initializeLevelRocks();
    restartGame();
}

function goToNextLevel() {
    if (currentLevelIndex + 1 < progress.unlocked) {
        loadLevel(currentLevelIndex + 1);
    }
}

function onLevelComplete() {
    // fewer wasted digging = more stars
    const ratio = digging.inkUsed / getLevel().par;

    water.stars = ratio <= 1.25 ? 3 : ratio <= 1.8 ? 2 : 1;

    progress.stars[currentLevelIndex] = Math.max(
        progress.stars[currentLevelIndex] || 0,
        water.stars
    );
    progress.unlocked = Math.max(
        progress.unlocked,
        Math.min(currentLevelIndex + 2, levels.length)
    );

    saveProgress();
    playSound("win");
    updateLevelUI();
}

document.getElementById("nextBtn").addEventListener("click", goToNextLevel);

loadProgress();
buildLevelSelect();
loadLevel(Math.min(progress.unlocked, levels.length) - 1);
