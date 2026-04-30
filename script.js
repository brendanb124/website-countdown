const timer6 = document.getElementById('timer6');
const timer7 = document.getElementById('timer7');

const targetDate6 = new Date('May 7, 2026 22:00:00').getTime();
const targetDate7 = new Date('May 7, 2026 22:00:00').getTime();

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
    if (timer6) timer6.textContent = "6. " + formatTime(targetDate6 - now);
    if (timer7) timer7.textContent = "7. " + formatTime(targetDate7 - now);
}
updateTimers();
setInterval(updateTimers, 1000);
