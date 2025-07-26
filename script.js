let player = null;
let pitchShift = null;
let fileURL = null;
let isPlaying = false;

// DOM取得
const audioFile = document.getElementById('audioFile');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const pitchSlider = document.getElementById('pitchSlider');
const pitchValue = document.getElementById('pitchValue');

// ファイル選択
audioFile.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (file) {
        if (player) {
            player.stop();
            player.disconnect();
            player.dispose();
        }
        if (pitchShift) {
            pitchShift.dispose();
        }

        fileURL = URL.createObjectURL(file);

        pitchShift = new Tone.PitchShift().toDestination();

        player = new Tone.Player({
            url: fileURL,
            autostart: false,
            loop: true
        });

        player.connect(pitchShift);

        enableControls(true);
        playButton.disabled = false;
        pauseButton.disabled = true;
        stopButton.disabled = true;
        resetSliders();
    }
});

// 再生
playButton.addEventListener('click', async () => {
    if (!player) return;
    await Tone.start();
    player.playbackRate = parseFloat(speedSlider.value);
    pitchShift.pitch = parseFloat(pitchSlider.value);
    player.start();
    isPlaying = true;
    playButton.disabled = true;
    pauseButton.disabled = false;
    stopButton.disabled = false;
});

// 一時停止
pauseButton.addEventListener('click', () => {
    if (player && isPlaying) {
        player.stop();
        isPlaying = false;
        playButton.disabled = false;
        pauseButton.disabled = true;
        stopButton.disabled = false;
    }
});

// 停止
stopButton.addEventListener('click', () => {
    if (player) {
        player.stop();
        isPlaying = false;
        playButton.disabled = false;
        pauseButton.disabled = true;
        stopButton.disabled = true;
    }
});

// リセット
resetButton.addEventListener('click', () => {
    resetSliders();
    if (player) {
        player.playbackRate = 1.0;
    }
    if (pitchShift) {
        pitchShift.pitch = 0;
    }
});

// スライダー変更
speedSlider.addEventListener('input', () => {
    const val = parseFloat(speedSlider.value);
    speedValue.textContent = val.toFixed(2) + 'x';
    if (player && isPlaying) {
        player.playbackRate = val;
    }
});

pitchSlider.addEventListener('input', () => {
    const val = parseFloat(pitchSlider.value);
    pitchValue.textContent = val.toFixed(1) + '半音';
    if (pitchShift) {
        pitchShift.pitch = val;
    }
});

// コントロール有効化
function enableControls(enable) {
    speedSlider.disabled = !enable;
    pitchSlider.disabled = !enable;
    resetButton.disabled = !enable;
}

function resetSliders() {
    speedSlider.value = 1.0;
    speedValue.textContent = '1.00x';
    pitchSlider.value = 0;
    pitchValue.textContent = '0.0半音';
}

window.addEventListener('DOMContentLoaded', () => {
    enableControls(false);
    playButton.disabled = true;
    pauseButton.disabled = true;
    stopButton.disabled = true;
    resetButton.disabled = true;
});