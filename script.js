const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');
const countdown = document.getElementById('countdown');

const targetDate = new Date('April 30 2026 00:00:00').getTime();

function timer() {
    const now = Date.now();
    let distance = targetDate - now;

    if (distance < 0) {
        distance = 0;
        clearInterval(interval);
    }

    const days = Math.floor(distance / (1000*60*60*24));
    const hours = Math.floor((distance / (1000*60*60)) % 24);
    const minutes = Math.floor((distance / (1000*60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    Days.textContent = String(days).padStart(2, "0");
    Hours.textContent = String(hours).padStart(2, "0");
    Minutes.textContent = String(minutes).padStart(2, "0");
    Seconds.textContent = String(seconds).padStart(2, "0");

    countdown.style.visibility = "visible";
}

timer();
const interval = setInterval(timer, 1000);