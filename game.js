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


// Game variables
let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let deck = createDeck(suits, ranks);
let guessCard = drawCard(deck);
let currentCard;
let score = 0;
let intervalId;

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
    //deck.splice(index, 1);
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
    }
}



// Update the game state
function updateGameState() {
    scoreElement.textContent = 'Score: ' + score;
    remainingElement.textContent = 'Cards remaining: ' + deck.length;
}

// Start the game
function startGame() {
    startButton.disabled = true;
    stopButton.disabled = false;
    guessButton.disabled = false;
    updateGameState();
    intervalId = setInterval(changeCurrentCard, 200);
}

// Make a guess
function makeGuess() {
    clearInterval(intervalId);
    guessButton.disabled = true;
    continueButton.disabled = false;
    if (guessCard.suit === currentCard.suit && guessCard.rank === currentCard.rank) {
        score += 100;
        resultMessage.textContent = 'Correct!';
    } else {
        resultMessage.textContent = 'Incorrect. The card was ' + guessCard.suit + ' ' + guessCard.rank;
    }
    guessCardImg.src = 'card-images/fronts/' + guessCard.suit + '_' + guessCard.rank + '.svg';

    let newGuess = document.createElement('li');
    newGuess.textContent = `Guess: ${currentCard.suit} ${currentCard.rank} - ${resultMessage.textContent}`;
    guessesList.appendChild(newGuess);

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
    guessButton.disabled = false;
    resetButton.disabled = false;
}

// reset the game
// reset the game
function resetGame() {
    location.reload();
}


window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 's':
            // Start game
            startGame();
            break;
        case 'g':
            // Make a guess
            makeGuess();
            break;
        case 'c':
            // Continue game
            continueGame();
            break;
        case 't':
            // Stop game
            stopGame();
            break;
        case 'r':
            // Reset game
            resetGame();
            break;
    }
});


// Event listeners for buttons
startButton.addEventListener('click', startGame);
guessButton.addEventListener('click', makeGuess);
continueButton.addEventListener('click', continueGame);
stopButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', resetGame);