// ----- Configuration Management -----
// Default configuration values
const defaultConfig = {
	workMinutes: 30,
	workSeconds: 0,
	breakMinutes: 5,
	breakSeconds: 0,
	audioURL: "beep.mp3",
	audioEnabled: true,
};

// Load configuration from localStorage (or use defaults)
function loadConfig() {
	const config = localStorage.getItem("pomodoroConfig");
	return config ? JSON.parse(config) : { ...defaultConfig };
}

// Save configuration to localStorage
function saveConfig(config) {
	localStorage.setItem("pomodoroConfig", JSON.stringify(config));
}

// ----- Timer Functionality (for index.html) -----
if (document.getElementById("time-display")) {
	// Only run timer code if on index.html
	let timerInterval;
	let isPaused = false;
	let remainingTime = 0;
	let currentMode = "work"; // "work" or "break"
	const config = loadConfig();

	// DOM elements
	const timeDisplay = document.getElementById("time-display");
	const modeLabel = document.getElementById("mode-label");
	const startBtn = document.getElementById("start-btn");
	const pauseBtn = document.getElementById("pause-btn");
	const resumeBtn = document.getElementById("resume-btn");
	const resetBtn = document.getElementById("reset-btn");
	const alarmAudio = document.getElementById("alarm-audio");
	const audioSource = document.getElementById("audio-source");

	// Set the audio source from configuration
	audioSource.src = config.audioURL;
	alarmAudio.load();

	// Set body background class based on mode
	function updateBackground() {
		document.body.classList.remove("work-mode", "break-mode");
		if (currentMode === "work") {
			document.body.classList.add("work-mode");
		} else {
			document.body.classList.add("break-mode");
		}
	}

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
			remainingTime = config.breakMinutes * 60 + config.breakSeconds;
		} else {
			currentMode = "work";
			modeLabel.textContent = "Work Time";
			remainingTime = config.workMinutes * 60 + config.workSeconds;
		}
		updateBackground();
		updateDisplay();
	}

	// Timer tick function
	function timerTick() {
		if (remainingTime > 0) {
			remainingTime--;
			updateDisplay();
		} else {
			// Play audio reminder if enabled
			if (config.audioEnabled) {
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
		remainingTime = config.workMinutes * 60 + config.workSeconds;
		updateBackground();
		updateDisplay();
		timerInterval = setInterval(timerTick, 1000);
		startBtn.disabled = true;
		pauseBtn.disabled = false;
		resetBtn.disabled = false;
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
		currentMode = "work";
		modeLabel.textContent = "Work Time";
		remainingTime = config.workMinutes * 60 + config.workSeconds;
		updateBackground();
		updateDisplay();
	}

	// Attach event listeners
	startBtn.addEventListener("click", startTimer);
	pauseBtn.addEventListener("click", pauseTimer);
	resumeBtn.addEventListener("click", resumeTimer);
	resetBtn.addEventListener("click", resetTimer);
}

// ----- Configuration Form Handling (for config.html) -----
if (document.getElementById("config-form")) {
	const configForm = document.getElementById("config-form");
	const workTimeMinutesInput = document.getElementById("workTimeMinutes");
	const workTimeSecondsInput = document.getElementById("workTimeSeconds");
	const breakTimeMinutesInput = document.getElementById("breakTimeMinutes");
	const breakTimeSecondsInput = document.getElementById("breakTimeSeconds");
	const audioURLInput = document.getElementById("audioURL");
	const audioEnabledInput = document.getElementById("audioEnabled");

	// Load existing configuration into the form
	const currentConfig = loadConfig();
	workTimeMinutesInput.value = currentConfig.workMinutes;
	workTimeSecondsInput.value = currentConfig.workSeconds;
	breakTimeMinutesInput.value = currentConfig.breakMinutes;
	breakTimeSecondsInput.value = currentConfig.breakSeconds;
	audioURLInput.value = currentConfig.audioURL;
	audioEnabledInput.checked = currentConfig.audioEnabled;

	// On form submit, save the configuration and go back to home
	configForm.addEventListener("submit", function (e) {
		e.preventDefault();
		const newConfig = {
			workMinutes: parseInt(workTimeMinutesInput.value) || 0,
			workSeconds: parseInt(workTimeSecondsInput.value) || 0,
			breakMinutes: parseInt(breakTimeMinutesInput.value) || 0,
			breakSeconds: parseInt(breakTimeSecondsInput.value) || 0,
			audioURL: audioURLInput.value || defaultConfig.audioURL,
			audioEnabled: audioEnabledInput.checked,
		};
		saveConfig(newConfig);
		// Redirect to home page after saving
		window.location.href = "index.html";
	});
}
