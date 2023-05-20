// DOM elements
let guessCardImg = document.getElementById('guess-card-img');
let currentCardImg = document.getElementById('current-card-img');
let resultMessage = document.getElementById('result-message');
let scoreElement = document.getElementById('score');
let remainingElement = document.getElementById('remaining-cards');
let previousGuesses = document.getElementById('previous-guesses');
let guessesList = document.getElementById('guesses-list');
let startButton = document.getElementById('start-button');
let guessButton = document.getElementById('guess-button');
let continueButton = document.getElementById('continue-button');
let stopButton = document.getElementById('stop-button');
let resetButton = document.getElementById('reset-button');
let versionElement = document.getElementById('version-info');

// Game variables
let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let deck = createDeck(suits, ranks);
let guessCard = drawCard(deck);
let currentCard;
let score = 0;
let intervalId;
let isGameRunning = false;
let version = "0.0.1";

// set buttons
guessButton.disabled = true;
continueButton.disabled = true;
stopButton.disabled = true;
resetButton.disabled = true;

versionElement.textContent = 'Version: ' + version;

// Create a deck of cards
function createDeck(suits, ranks) {
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ suit: suit, rank: rank });
        }
    }
    return deck;
}

// Draw a card from the deck
function drawCard(deck) {
    let index = Math.floor(Math.random() * deck.length);
    let card = deck[index];
    return card;
}

// Change the current card
function changeCurrentCard() {
    if (deck.length > 0) {
        currentCard = deck[Math.floor(Math.random() * deck.length)];
        currentCardImg.src = 'card-images/fronts/' + currentCard.suit + '_' + currentCard.rank + '.svg';
    } else {
        clearInterval(intervalId);
        resultMessage.textContent = 'Game over';
        isGameRunning = false;
    }
}

// Update the game state
function updateGameState() {
    scoreElement.textContent = 'Score: ' + score;
    remainingElement.textContent = 'Cards remaining: ' + deck.length;
}

// Start the game
function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    startButton.disabled = true;
    stopButton.disabled = true;
    guessButton.disabled = false;
    updateGameState();
    intervalId = setInterval(changeCurrentCard, 200);
}


// Make a guess
function makeGuess() {
    if (!isGameRunning) return;
    
    clearInterval(intervalId);
    guessButton.disabled = true;
    continueButton.disabled = false;
    resultMessage.className = ''; // Reset class
    let correctRank = guessCard.rank === currentCard.rank;
    let correctSuit = guessCard.suit === currentCard.suit;

    if (correctRank && correctSuit) {
        score += 100;
        resultMessage.textContent = 'Correct! You got both the rank and suit!';
        resultMessage.classList.add('correct'); // Add class
    } else if (correctSuit) {
        score += 10;
        resultMessage.textContent = 'Good job! You got the suit!';
        resultMessage.classList.add('partial-correct'); // Add class
    } else if (correctRank) {
        score += 20;
        resultMessage.textContent = 'Nice! You got the rank!';
        resultMessage.classList.add('partial-correct'); // Add class
    } else {
        resultMessage.textContent = 'Incorrect. The card was the ' + guessCard.rank + ' of ' + guessCard.suit + '.';
        score -= 5;
        resultMessage.classList.add('incorrect'); // Add class
    }
    guessCardImg.src = 'card-images/fronts/' + guessCard.suit + '_' + guessCard.rank + '.svg';
    let newGuess = document.createElement('li');
    newGuess.textContent = `Guess: ${currentCard.rank} of ${currentCard.suit} - ${resultMessage.textContent}`;
    guessesList.prepend(newGuess);
    deck = deck.filter(card => card !== currentCard);
    guessCard = drawCard(deck);
    updateGameState();
}


// Continue the game
function continueGame() {
    continueButton.disabled = true;
    stopButton.disabled = false;
    guessButton.disabled = false;
    guessCardImg.src = 'card-images/backs/red2.svg';
    if (deck.length > 0) {
        intervalId = setInterval(changeCurrentCard, 200);
    } else {
        resultMessage.textContent += ' Game over';
    }
}

// Stop the game
function stopGame() {
    clearInterval(intervalId);
    stopButton.disabled = true;
    resetButton.disabled = false;
    guessButton.disabled = true;
    continueButton.disabled = true;
    resultMessage.textContent = 'Game stopped';
    isGameRunning = false;
}

// reset the game
function resetGame() {
    location.reload();
}

// keyboard shortcuts
window.addEventListener('keydown', function (e) {
    if (isGameRunning) {
        switch (e.key) {
            case 'g':
                // Make a guess
                if (!guessButton.disabled) {
                    makeGuess();
                }
                break;
            case 'c':
                // Continue game
                if (!continueButton.disabled) {
                    continueGame();
                }
                break;
            case 't':
                // Stop game
                if (!stopButton.disabled) {
                    stopGame();
                }
                break;
        }
    } else {
        if (e.key === 's') {
            // Start game
            startGame();
        } else if (e.key === 'r') {
            // Reset game
            if (!resetButton.disabled) {
                resetGame();
            }
        }
    }
});


// Event listeners for buttons
startButton.addEventListener('click', startGame);
guessButton.addEventListener('click', makeGuess);
continueButton.addEventListener('click', continueGame);
stopButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', resetGame);
