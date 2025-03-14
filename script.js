// Variables to keep track of timer state
let timerInterval;
let isPaused = false;
let remainingTime = 0;
let currentMode = "work"; // "work" or "break"

// DOM elements
const timeDisplay = document.getElementById("time-display");
const modeLabel = document.getElementById("mode-label");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");
const resetBtn = document.getElementById("reset-btn");
const workTimeMinutesInput = document.getElementById("workTimeMinutes");
const workTimeSecondsInput = document.getElementById("workTimeSeconds");
const breakTimeMinutesInput = document.getElementById("breakTimeMinutes");
const breakTimeSecondsInput = document.getElementById("breakTimeSeconds");
const audioToggle = document.getElementById("audioToggle");
const alarmAudio = document.getElementById("alarm-audio");

// Format seconds as MM:SS
function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs
		.toString()
		.padStart(2, "0")}`;
}

// Update the time display
function updateDisplay() {
	timeDisplay.textContent = formatTime(remainingTime);
}

// Switch between Work and Break modes
function switchMode() {
	if (currentMode === "work") {
		currentMode = "break";
		modeLabel.textContent = "Break Time";
		const breakMinutes = parseInt(breakTimeMinutesInput.value) || 0;
		const breakSeconds = parseInt(breakTimeSecondsInput.value) || 0;
		remainingTime = breakMinutes * 60 + breakSeconds;
	} else {
		currentMode = "work";
		modeLabel.textContent = "Work Time";
		const workMinutes = parseInt(workTimeMinutesInput.value) || 0;
		const workSeconds = parseInt(workTimeSecondsInput.value) || 0;
		remainingTime = workMinutes * 60 + workSeconds;
	}
	updateDisplay();
}

// Timer tick function
function timerTick() {
	if (remainingTime > 0) {
		remainingTime--;
		updateDisplay();
	} else {
		// Play audio reminder if enabled
		if (audioToggle.checked) {
			alarmAudio.currentTime = 0;
			alarmAudio.play();
		}
		// Automatically switch mode when time is up
		switchMode();
	}
}

// Start the timer
function startTimer() {
	currentMode = "work";
	modeLabel.textContent = "Work Time";
	const workMinutes = parseInt(workTimeMinutesInput.value) || 0;
	const workSeconds = parseInt(workTimeSecondsInput.value) || 0;
	remainingTime = workMinutes * 60 + workSeconds;
	updateDisplay();

	timerInterval = setInterval(timerTick, 1000);
	startBtn.disabled = true;
	pauseBtn.disabled = false;
	resetBtn.disabled = false;
	// Disable time inputs while running
	workTimeMinutesInput.disabled = true;
	workTimeSecondsInput.disabled = true;
	breakTimeMinutesInput.disabled = true;
	breakTimeSecondsInput.disabled = true;
}

// Pause the timer
function pauseTimer() {
	clearInterval(timerInterval);
	isPaused = true;
	pauseBtn.disabled = true;
	resumeBtn.disabled = false;
}

// Resume the timer
function resumeTimer() {
	if (isPaused) {
		timerInterval = setInterval(timerTick, 1000);
		isPaused = false;
		pauseBtn.disabled = false;
		resumeBtn.disabled = true;
	}
}

// Reset the timer to its initial state
function resetTimer() {
	clearInterval(timerInterval);
	isPaused = false;
	startBtn.disabled = false;
	pauseBtn.disabled = true;
	resumeBtn.disabled = true;
	resetBtn.disabled = true;
	// Enable time inputs again
	workTimeMinutesInput.disabled = false;
	workTimeSecondsInput.disabled = false;
	breakTimeMinutesInput.disabled = false;
	breakTimeSecondsInput.disabled = false;

	currentMode = "work";
	modeLabel.textContent = "Work Time";
	const workMinutes = parseInt(workTimeMinutesInput.value) || 0;
	const workSeconds = parseInt(workTimeSecondsInput.value) || 0;
	remainingTime = workMinutes * 60 + workSeconds;
	updateDisplay();
}

// Attach event listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resumeBtn.addEventListener("click", resumeTimer);
resetBtn.addEventListener("click", resetTimer);
