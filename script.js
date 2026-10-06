
/*
const timer6 = document.getElementById('timer6');
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
    if (timer8) timer8.textContent = "8. " + formatTime(targetDate - now);
    if (timer9) timer9.textContent = "9. " + formatTime(targetDate - now);
}
updateTimers();
setInterval(updateTimers, 1000);
*/

const tracks = document.querySelectorAll(".track");
const audioTracks = document.querySelectorAll("audio");
const mainPlay = document.getElementById("main-play");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const currentTitle = document.getElementById("current-title");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

let currentIndex = -1;

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateButtons() {
    tracks.forEach((track, index) => {
        const button = track.querySelector(".track-play");

        if (index === currentIndex && !audioTracks[index].paused) {
            button.textContent = "❚❚";
        } else {
            button.textContent = "▶";
        }
    });

    if (currentIndex !== -1 && !audioTracks[currentIndex].paused) {
        mainPlay.textContent = "❚❚";
    } else {
        mainPlay.textContent = "▶";
    }
}

function setCurrentTrack(index) {
    if (index < 0 || index >= audioTracks.length) {
        return;
    }

    audioTracks.forEach((audio, audioIndex) => {
        if (audioIndex !== index) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    tracks.forEach(track => {
        track.classList.remove("active");
    });

    currentIndex = index;
    tracks[index].classList.add("active");
    currentTitle.textContent = tracks[index].querySelector("h2").textContent;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = formatTime(audioTracks[index].duration);

    updateButtons();
}

async function playCurrentTrack() {
    if (currentIndex === -1) {
        setCurrentTrack(0);
    }

    try {
        await audioTracks[currentIndex].play();
    } catch (error) {
        console.log(error);
    }

    updateButtons();
}

function pauseCurrentTrack() {
    if (currentIndex !== -1) {
        audioTracks[currentIndex].pause();
    }

    updateButtons();
}

function toggleCurrentTrack() {
    if (currentIndex === -1) {
        setCurrentTrack(0);
        playCurrentTrack();
        return;
    }

    if (audioTracks[currentIndex].paused) {
        playCurrentTrack();
    } else {
        pauseCurrentTrack();
    }
}

function playNextTrack() {
    if (currentIndex === -1) {
        setCurrentTrack(0);
    } else {
        currentIndex = (currentIndex + 1) % audioTracks.length;
        setCurrentTrack(currentIndex);
    }

    playCurrentTrack();
}

function playPreviousTrack() {
    if (currentIndex === -1) {
        setCurrentTrack(0);
        playCurrentTrack();
        return;
    }

    if (audioTracks[currentIndex].currentTime > 3) {
        audioTracks[currentIndex].currentTime = 0;
        return;
    }

    currentIndex = (currentIndex - 1 + audioTracks.length) % audioTracks.length;
    setCurrentTrack(currentIndex);
    playCurrentTrack();
}

tracks.forEach((track, index) => {
    const button = track.querySelector(".track-play");

    track.addEventListener("click", event => {
        if (event.target === button) {
            return;
        }

        if (currentIndex === index) {
            toggleCurrentTrack();
        } else {
            setCurrentTrack(index);
            playCurrentTrack();
        }
    });

    button.addEventListener("click", event => {
        event.stopPropagation();

        if (currentIndex === index) {
            toggleCurrentTrack();
        } else {
            setCurrentTrack(index);
            playCurrentTrack();
        }
    });
});

audioTracks.forEach((audio, index) => {
    audio.volume = 1;

    audio.addEventListener("loadedmetadata", () => {
        tracks[index].querySelector(".track-time").textContent =
            formatTime(audio.duration);

        if (index === currentIndex) {
            duration.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener("play", () => {
        currentIndex = index;
        tracks[index].classList.add("active");
        currentTitle.textContent = tracks[index].querySelector("h2").textContent;
        updateButtons();
    });

    audio.addEventListener("pause", () => {
        updateButtons();
    });

    audio.addEventListener("timeupdate", () => {
        if (index !== currentIndex) {
            return;
        }

        if (audio.duration) {
            progress.value = (audio.currentTime / audio.duration) * 100;
        }

        currentTime.textContent = formatTime(audio.currentTime);
        duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("ended", () => {
        const nextIndex = (index + 1) % audioTracks.length;
        setCurrentTrack(nextIndex);
        playCurrentTrack();
    });
});

mainPlay.addEventListener("click", toggleCurrentTrack);
nextButton.addEventListener("click", playNextTrack);
previousButton.addEventListener("click", playPreviousTrack);

progress.addEventListener("input", () => {
    if (currentIndex === -1) {
        return;
    }

    const audio = audioTracks[currentIndex];

    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

volume.addEventListener("input", () => {
    audioTracks.forEach(audio => {
        audio.volume = volume.value;
    });
});

document.addEventListener("keydown", event => {
    if (event.target.tagName === "INPUT") {
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();
        toggleCurrentTrack();
    }

    if (event.code === "ArrowRight") {
        playNextTrack();
    }

    if (event.code === "ArrowLeft") {
        playPreviousTrack();
    }
});

updateButtons();
