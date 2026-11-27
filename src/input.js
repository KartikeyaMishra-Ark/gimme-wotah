canvas.addEventListener("pointerdown", startDigging);
canvas.addEventListener("pointermove", continueDigging);
canvas.addEventListener("pointerup", stopDigging);
canvas.addEventListener("pointercancel", stopDigging);

window.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    const key = event.key.toLowerCase();

    if (document.activeElement) document.activeElement.blur();

    if (key === "r") {
        restartGame();
    }
    else if (key === " ") {
        event.preventDefault();
        releaseWater();
    }
    else if (key === "n" && water.completed) {
        goToNextLevel();
    }
    else if (key === "m") {
        audio.muted = !audio.muted;
    }
})
