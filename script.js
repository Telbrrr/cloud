// Function to generate a random number between min and max
function random(max, min = 0) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Function to track the position of the mouse */
function getCoords(e) {
	const x = e.clientX;
	const y = e.clientY;

	// Eye animation - improvement of cursor tracking
	const eyes = document.querySelectorAll(".eye");
	eyes.forEach((eye) => {
		const rect = eye.getBoundingClientRect();
		const eyeX = rect.left + rect.width / 2;
		const eyeY = rect.top + rect.height / 2;

		// Calculate the angle between the eye and the mouse
		const angle = Math.atan2(y - eyeY, x - eyeX);

		// Calculate the distance for a natural parallax effect
		const dx = x - eyeX;
		const dy = y - eyeY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Limit the distance for a better effect
		const maxDistance = 4;
		const factor = Math.min(distance / 100, 1); // Factor based on the distance

		// Calculate the movements with the adjusted distance
		const moveX = Math.cos(angle) * maxDistance * factor;
		const moveY = Math.sin(angle) * maxDistance * factor;

		// Apply a transformation in the direction of the cursor
		eye.style.transform = `translate(${moveX}px, ${moveY}px)`;

		// Adjust the position of the reflections in the eyes to improve the effect of looking
		const reflection = eye.querySelector(".eye-reflection");
		if (reflection) {
			reflection.style.transform = `translate(${moveX / 3}px, ${moveY / 3}px)`;
		}

		const secondaryReflection = eye.querySelector(".eye-reflection-secondary");
		if (secondaryReflection) {
			secondaryReflection.style.transform = `translate(${moveX / 5}px, ${
				moveY / 5
			}px)`;
		}
	});
}

// Function to play a cricket sound
function playSound() {
	// Creating an oscillator to simulate the sound of a cricket
	try {
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();

		// Create two oscillators for a richer sound
		const osc1 = audioContext.createOscillator();
		const osc2 = audioContext.createOscillator();

		// Gain to control the volume
		const gainNode = audioContext.createGain();
		gainNode.gain.value = 0.05; // Low volume to not be too loud

		// Configure the oscillators
		osc1.type = "square";
		osc1.frequency.value = 4200;

		osc2.type = "square";
		osc2.frequency.value = 4500;

		// Connect the oscillators to the gain then to the output
		osc1.connect(gainNode);
		osc2.connect(gainNode);
		gainNode.connect(audioContext.destination);

		// Volume modulation to create the "cri-cri" effect
		const now = audioContext.currentTime;
		gainNode.gain.setValueAtTime(0, now);
		gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01);
		gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
		gainNode.gain.linearRampToValueAtTime(0.05, now + 0.06);
		gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

		// Start and stop the oscillators
		osc1.start(now);
		osc2.start(now);
		osc1.stop(now + 0.1);
		osc2.stop(now + 0.1);
	} catch (e) {
		console.log("Sound disabled due to browser policies");
	}
}

// Function to create a cricket with random variations
function createCricket() {
	const cricket = document.createElement("div");
	cricket.className = "cell";

	// Add a slight random rotation for more naturalness
	const randomRotation = random(5, -5);
	cricket.style.transform = `rotate(${randomRotation}deg)`;

	// Add a slight size variation (between 95% and 105%)
	const sizeVariation = 0.95 + Math.random() * 0.1;
	cricket.style.scale = sizeVariation;

	// Slight variation of the hue (subtle) - Use variations based on prime numbers
	// to illustrate the Cicada principle
	const primeOffset = Math.floor(Math.random() * 13); // Offset based on prime numbers
	const hueRotation = [-5, -3, -1, 0, 1, 3, 5][primeOffset % 7]; // 7 is a prime number
	cricket.style.filter = `hue-rotate(${hueRotation}deg)`;

	// Create all the elements of the cricket
	const elements = [
		{ class: "wing wing-left" },
		{ class: "wing wing-right" },
		{ class: "wing-pattern wing-pattern-left" },
		{ class: "wing-pattern wing-pattern-right" },
		{ class: "body" },
		{ class: "head" },
		{ class: "antenna antenna-left" },
		{ class: "antenna antenna-right" },
		{ class: "antenna-tip antenna-tip-left" },
		{ class: "antenna-tip antenna-tip-right" },
		{ class: "eye eye-left" },
		{ class: "eye eye-right" }
	];

	// Add each element to the cricket
	elements.forEach((element) => {
		const div = document.createElement("div");
		div.className = element.class;
		cricket.appendChild(div);
	});

	// Add reflection elements to the eyes for a better tracking effect
	const eyeLeft = cricket.querySelector(".eye-left");
	const eyeRight = cricket.querySelector(".eye-right");

	if (eyeLeft && eyeRight) {
		// Add the main reflections
		const reflectionLeft = document.createElement("div");
		reflectionLeft.className = "eye-reflection";
		eyeLeft.appendChild(reflectionLeft);

		const reflectionRight = document.createElement("div");
		reflectionRight.className = "eye-reflection";
		eyeRight.appendChild(reflectionRight);

		// Add the secondary reflections
		const secondaryReflectionLeft = document.createElement("div");
		secondaryReflectionLeft.className = "eye-reflection-secondary";
		eyeLeft.appendChild(secondaryReflectionLeft);

		const secondaryReflectionRight = document.createElement("div");
		secondaryReflectionRight.className = "eye-reflection-secondary";
		eyeRight.appendChild(secondaryReflectionRight);
	}

	// Add a click event for a special animation
	cricket.addEventListener("click", function () {
		// Force the recalculation of styles before the animation
		this.getBoundingClientRect();

		// Activate material acceleration
		this.style.willChange = "transform, filter";

		// Add a class for the jump animation
		this.classList.add("jump");

		// Play a cricket sound
		playSound();

		// Cleanup after the animation
		setTimeout(() => {
			this.classList.remove("jump");
			this.style.willChange = "auto";
		}, 1000);
	});

	return cricket;
}

// Function to initialize the grid with appearance animation
function initGrid(count = 65) {
	const artboard = document.getElementById("artboard");
	artboard.innerHTML = "";

	// Calculate the approximate number of columns and rows
	// Use a prime number for the columns to reinforce the Cicada principle
	const columns = Math.ceil(Math.sqrt(count * 1.5));
	const rows = Math.ceil(count / columns);

	// Array of delays based on prime numbers for the animation
	const primeDelays = [2, 3, 5, 7, 11, 13, 17, 19, 23];

	// Create the crickets and add them to the artboard with a delay for the animation
	for (let i = 0; i < count; i++) {
		const cricket = createCricket();
		cricket.style.opacity = "0";

		// Calculate the approximate position in the grid
		const row = Math.floor(i / columns);
		const col = i % columns;

		// Appearance animation with delay based on position and prime numbers
		// More complex wave effect using the Cicada principle
		const primeIndex = (row * col) % primeDelays.length;
		const delay = (row + col) * 30 + primeDelays[primeIndex] * 10;

		cricket.style.transform = `${cricket.style.transform} translateY(15px) scale(0.95)`;
		artboard.appendChild(cricket);

		// Appearance animation with progressive delay
		setTimeout(() => {
			cricket.style.transition = "opacity 0.6s ease, transform 0.6s ease";
			cricket.style.opacity = "1";
			cricket.style.transform = cricket.style.transform.replace(
				"translateY(15px) scale(0.95)",
				""
			);
		}, delay);
	}
}

// Initialize the controls and the grid when the page loads
document.addEventListener("DOMContentLoaded", () => {
	// Initialize the grid
	initGrid();

	infoBox.addEventListener("mouseleave", () => {
		infoBox.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
	});
});
