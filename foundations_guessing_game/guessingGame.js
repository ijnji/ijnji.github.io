/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.


/* **** Guessing Game Functions **** */

function guessSubmission(state)  {
	if (state.gameOver === true) return;

	var elemGuess = document.getElementById('id-input');
	guessingNumber = Number(elemGuess.value);
	elemGuess.value = ''

	if (guessingNumber < 1 ||guessingNumber > 100 ||
		guessingNumber == undefined || isNaN(guessingNumber)) {
			generateInvalidResponse();
			return;
	}
	generateGuessResponse(guessingNumber);
	if (state.checkNumber(guessingNumber)) {
		generateSameResponse(guessingNumber);
	}
	else if (state.winningNumber === guessingNumber) {
		generateHitResponse();
		state.gameOver = true;
	} else {
		var near = (Math.abs(state.winningNumber - guessingNumber) <= 25);
		var high = (state.winningNumber > guessingNumber);
		generateMissResponse(near, high);
	}
}

function resetSubmission(state) {
	state.newNumber();
	state.gameOver = false;
	generateInitialDialogue();
}

function hintSubmission(state) {
	if (state.gameOver === true) return;

	generateHintResponse(state.winningNumber);
}

function resetInput() {
	document.getElementById('id-input').focus();
	document.getElementById('id-input').value = '';
}

function scrollToBottom() {
	document.getElementById('id-input-hint').scrollIntoView();
}

function randomLine(responses) {
	var i = Math.floor(Math.random() * responses.length);
	return responses[i]; 
}

function generateInitialDialogue() {
	var initialDialogue = [
		'<p>Me: Ugh, I\'m totally falling asleep right now.  Went to bed late last night, and this class isn\'t helping...</p>',
		'<p>Me: Hey!  Let\'s play a game... I\'m thinking of a number between <span style="color: yellow;">1-100... can you guess it?</span></p>',
		'<p>You: Lol... is it...</p>'
	];

	var elemDialogue = document.getElementById('id-dialogue');
	elemDialogue.innerHTML = '';
	for (var i = 0; i < initialDialogue.length; i++) {
		elemDialogue.innerHTML += initialDialogue[i];
	}

	scrollToBottom();
}

function generateHintResponse(winningNumber) {
	var lo = winningNumber - (winningNumber % 10) + 1;
	var hi = lo + 9;

	var elemDialogue = document.getElementById('id-dialogue');
	elemDialogue.innerHTML += '<p>You: I want a hint.</p>';
	elemDialogue.innerHTML += '<p>Me: K, it\'s between <span style="color: yellow">' + String(lo) + ' and ' + String(hi) + '.</span></p>';
	
	scrollToBottom();
}

function generateGuessResponse(guessingNumber) {
	var elemDialogue = document.getElementById('id-dialogue');
	elemDialogue.innerHTML += '<p>You: Is it <span style="color: yellow;">' + guessingNumber + '</span>?</p>';

	scrollToBottom();
}

function generateSameResponse(guessingNumber) {
	var elemDialogue = document.getElementById('id-dialogue');
	elemDialogue.innerHTML += '<p>Me: You already guessed <span style="font-weight: bold; color:yellow">' + String(guessingNumber) + '.</span></p>';

	scrollToBottom();
}

function generateInvalidResponse() {
	var invalidResponses = [
		'<p>Me: Huh..?',
		'<p>Me: I can\'t even...</p>',
		'<p>Me: <span style="font-family: Arial">[.______.]</span></p>',
		'<p>Me: <span style="font-family: Arial">(==____==;;)</span></p>'
	];
	var elemDialogue = document.getElementById('id-dialogue');
	elemDialogue.innerHTML += randomLine(invalidResponses);

	scrollToBottom();
}

function generateMissResponse(near, high) {
	var missResponses = [
		'<p>Me: Nope! ',
		'<p>Me: Not quite... ',
		'<p>Me: Sorry! ',
		'<p>Me: Try again! '
	];

	var nearResponses = [
		'That\'s close though. ',
		'Close! ',
		'It\'s around there... '
	];

	var farResponses = [
		'That\'s not even close :) ',
		'Way off >_< ',
		'Nowhere near :( '
	];

	var upperResponses = [
		'Try going up.</p>',
		'Higher than that.</p>'
	];

	var lowerResponses = [
		'Lower.</p>',
		'It\'s lower than that.</p>'
	];

	var elemDialogue = document.getElementById('id-dialogue');
	var combinedLine = randomLine(missResponses);
	if (near) {
		combinedLine += randomLine(nearResponses);
	} else {
		combinedLine += randomLine(farResponses);
	}
	if (high) {
		combinedLine += randomLine(upperResponses);
	} else {
		combinedLine += randomLine(lowerResponses);
	}
	elemDialogue.innerHTML += combinedLine;

	scrollToBottom();
}

function generateHitResponse() {
	var hitResponses = [
		'<p>Me: <span style="font-size: 1.75em; color: yellow;">That\'s right!</span></p>',
		'<p>Me: <span style="font-size: 1.75em; color: yellow;">Yeah! That\'s it!</span></p>',
		'<p>Me: <span style="font-size: 1.75em; color: yellow;">Hey! Yup!</span></p>',
		'<p>Me: <span style="font-size: 1.75em; color: yellow;">You got it! Yeah!</span></p>'
	];

	var againResponses = [
		'<p>Me: Guess another number?',
		'<p>Me: Wanna play again?'
	];

	var elemDialogue = document.getElementById('id-dialogue');
	elemDialogue.innerHTML += randomLine(hitResponses);
	elemDialogue.innerHTML += randomLine(againResponses);

	scrollToBottom();
}


/* **** Event Listeners/Handlers ****  */ 

function initialize() {
	var elemGuess = document.getElementById('id-input-guess');
	var elemReset = document.getElementById('id-input-reset');
	var elemHint = document.getElementById('id-input-hint');

	var state = {
		winningNumber: undefined,
		previousGuesses: {},
		gameOver: false,
		newNumber: function() {
			this.winningNumber = Math.floor(Math.random() * 99) + 1;
			this.previousGuesses = {};
		},
		checkNumber: function(guessingNumber) {
			if (this.winningNumber === undefined) return false;
			if (this.previousGuesses.hasOwnProperty(guessingNumber)) {
				return true;
			} else {
				this.previousGuesses[guessingNumber] = true;
				return false;
			}
		}
	};

	state.newNumber();

	elemGuess.addEventListener('click', function() {
		guessSubmission(state);
		resetInput();
	});

	elemReset.addEventListener('click', function() {
		resetSubmission(state);
		resetInput();
	});

	elemHint.addEventListener('click', function() {
		hintSubmission(state);
		resetInput();
	});

	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		if (keyName === 'Enter') {
			guessSubmission(state);
			resetInput();
		}
	});

	resetInput();

	generateInitialDialogue();
}
