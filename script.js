
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

const tracks = Array.from(document.querySelectorAll(".track"));
const audios = tracks.map(track => track.querySelector("audio"));
const playButtons = tracks.map(track => track.querySelector(".track-play"));
const timeDisplays = tracks.map(track => track.querySelector(".track-time"));

const mainPlay = document.getElementById("main-play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const volume = document.getElementById("volume");
const progress = document.getElementById("progress");

const currentTitle = document.getElementById("current-title");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

let currentIndex = -1;

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "--:--";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function setPlayIcon(element) {
    element.innerHTML = '<span class="play-icon"></span>';
}

function setPauseIcon(element) {
    element.innerHTML = '<span class="pause-icon"></span>';
}

function resetTrackButtons() {
    playButtons.forEach(button => {
        setPlayIcon(button);
    });
}

function setActiveTrack(index) {
    tracks.forEach((track, i) => {
        track.classList.toggle("active", i === index);
    });

    resetTrackButtons();

    if (index >= 0) {
        setPauseIcon(playButtons[index]);
        playButtons[index].setAttribute("aria-label", "Pause");
    }

    playButtons.forEach((button, i) => {
        if (i !== index) {
            button.setAttribute("aria-label", `Play ${tracks[i].querySelector("h2").textContent}`);
        }
    });
}

function updateMainButton(isPlaying) {
    if (isPlaying) {
        setPauseIcon(mainPlay);
        mainPlay.setAttribute("aria-label", "Pause");
    } else {
        setPlayIcon(mainPlay);
        mainPlay.setAttribute("aria-label", "Play");
    }
}

function updatePlayer(index) {
    if (index < 0) {
        currentTitle.textContent = "Select a song";
        currentTimeDisplay.textContent = "0:00";
        durationDisplay.textContent = "0:00";
        updateMainButton(false);
        return;
    }

    currentTitle.textContent = tracks[index].querySelector("h2").textContent;

    const audio = audios[index];

    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
}

function loadTrack(index, autoplay = false) {
    if (index < 0 || index >= tracks.length) {
        return;
    }

    audios.forEach((audio, i) => {
        if (i !== index) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    currentIndex = index;

    const audio = audios[index];

    audio.volume = Number(volume.value);

    setActiveTrack(index);
    updatePlayer(index);

    progress.value = 0;
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = formatTime(audio.duration);

    if (autoplay) {
        audio.play().then(() => {
            updateMainButton(true);
        }).catch(() => {
            updateMainButton(false);
        });
    } else {
        updateMainButton(false);
    }
}

function togglePlay(index) {
    const audio = audios[index];

    if (currentIndex !== index) {
        loadTrack(index, true);
        return;
    }

    if (audio.paused) {
        audio.play().then(() => {
            setActiveTrack(index);
            updateMainButton(true);
        }).catch(() => {
            updateMainButton(false);
        });
    } else {
        audio.pause();
        updateMainButton(false);
        setPlayIcon(playButtons[index]);
    }
}

function nextTrack() {
    if (tracks.length === 0) {
        return;
    }

    const nextIndex = currentIndex < 0
        ? 0
        : (currentIndex + 1) % tracks.length;

    loadTrack(nextIndex, true);
}

function previousTrack() {
    if (tracks.length === 0) {
        return;
    }

    if (currentIndex < 0) {
        loadTrack(0, true);
        return;
    }

    const audio = audios[currentIndex];

    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;

    loadTrack(previousIndex, true);
}

tracks.forEach((track, index) => {
    const audio = audios[index];

    playButtons[index].addEventListener("click", () => {
        togglePlay(index);
    });

    audio.addEventListener("loadedmetadata", () => {
        const duration = formatTime(audio.duration);

        timeDisplays[index].textContent = duration;

        if (currentIndex === index) {
            durationDisplay.textContent = duration;
        }
    });

    audio.addEventListener("durationchange", () => {
        const duration = formatTime(audio.duration);

        timeDisplays[index].textContent = duration;

        if (currentIndex === index) {
            durationDisplay.textContent = duration;
        }
    });

    audio.addEventListener("timeupdate", () => {
        if (currentIndex !== index) {
            return;
        }

        const current = audio.currentTime;
        const duration = audio.duration;

        currentTimeDisplay.textContent = formatTime(current);
        durationDisplay.textContent = formatTime(duration);

        if (Number.isFinite(duration) && duration > 0) {
            progress.value = (current / duration) * 100;
        }
    });

    audio.addEventListener("play", () => {
        if (currentIndex === index) {
            setActiveTrack(index);
            updateMainButton(true);
        }
    });

    audio.addEventListener("pause", () => {
        if (currentIndex === index) {
            updateMainButton(false);
            setPlayIcon(playButtons[index]);
        }
    });

    audio.addEventListener("ended", () => {
        const nextIndex = (index + 1) % tracks.length;
        loadTrack(nextIndex, true);
    });

    audio.addEventListener("error", () => {
        timeDisplays[index].textContent = "--:--";
    });
});

mainPlay.addEventListener("click", () => {
    if (currentIndex < 0) {
        loadTrack(0, true);
        return;
    }

    togglePlay(currentIndex);
});

previous.addEventListener("click", previousTrack);

next.addEventListener("click", nextTrack);

volume.addEventListener("input", () => {
    const value = Number(volume.value);

    audios.forEach(audio => {
        audio.volume = value;
    });
});

progress.addEventListener("input", () => {
    if (currentIndex < 0) {
        return;
    }

    const audio = audios[currentIndex];

    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
    }

    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});

audios.forEach(audio => {
    audio.volume = 1;
});

resetTrackButtons();
updatePlayer(-1);
