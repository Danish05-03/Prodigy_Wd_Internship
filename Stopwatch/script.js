const timeDisplay = document.querySelector('.time-display');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapsContainer = document.querySelector('.laps');

let timer = null;
let elapsedSeconds = 0;

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function updateTime() {
  timeDisplay.textContent = formatTime(elapsedSeconds);
}

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      elapsedSeconds++;
      updateTime();
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  pauseTimer();
  elapsedSeconds = 0;
  updateTime();
  lapsContainer.innerHTML = '';
}

function addLap() {
  const lapTime = formatTime(elapsedSeconds);
  const lapElement = document.createElement('li');
  lapElement.textContent = `Lap: ${lapTime}`;
  lapsContainer.appendChild(lapElement);
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
lapButton.addEventListener('click', addLap);
