const timer6 = document.getElementById('timer6');
const timer7 = document.getElementById('timer7');
const timer8 = document.getElementById('timer8');
const timer9 = document.getElementById('timer9');
const targetDate = new Date('October 2, 2026 00:00:00').getTime();

function formatTime(distance) {
    if (distance <= 0) return "00:00:00:00";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimers() {
    const now = Date.now();
    if (timer6) timer6.textContent = "6. " + formatTime(targetDate - now);
    if (timer7) timer7.textContent = "7. " + formatTime(targetDate - now);
    if (timer8) timer8.textContent = "8. " + formatTime(targetDate - now);
    if (timer9) timer9.textContent = "9. " + formatTime(targetDate - now);
}
updateTimers();
setInterval(updateTimers, 1000);

const tracks = document.querySelectorAll("audio");

tracks.forEach((track, index) => {
    track.addEventListener("play", () => {
        tracks.forEach((otherTrack, otherIndex) => {
            if (otherIndex !== index) {
                otherTrack.pause();
            }
        });
    });

    track.addEventListener("ended", () => {
        if (index < tracks.length - 1) {
            tracks[index + 1].play();
        }
    });
});
