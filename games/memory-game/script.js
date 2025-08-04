const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const restartBtn = document.getElementById('restart');
const startBtn = document.getElementById('startBtn');
const continueBtn = document.getElementById('continueBtn');
const startModal = document.getElementById('startModal');
const winModal = document.getElementById('winModal');
const instructionDiv = document.getElementById('typedText');
const finalMoves = document.getElementById('finalMoves');
const matchPopup = document.getElementById('matchPopup');
const matchMessage = document.getElementById('matchMessage');

const flipSound = new Audio('sounds/flip.mp3');
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');
const bgMusic = document.getElementById('bgMusic');
const typingSound = new Audio('sounds/type.wav');

flipSound.volume = 0.4;
correctSound.volume = 0.4;
incorrectSound.volume = 0.4;
typingSound.volume = 0.2;
bgMusic.volume = 0.3;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let popupTimeout;
const totalPairs = 8;

let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);


const messages = [
  "Tari smartness toh ekdam vaaras ni property lage che—rare ane precious.",
  "Genius looks good on you",
  "You're not just smart, you're irresistibly brilliant.",
  "Jab tu bolti hai na, lagta hai TED Talk chalu che—with extra cuteness.",
  "Beauty with brains",
  "You're the only equation I never want to solve—just admire",
  "Itni brilliant che ke Google pan tane consult kare",
  "I swear, even Einstein would’ve had a crush on you",
  "Tu samjhe che ke tu genius che? Kyare thi itlaa cute log bhi dangerous banva lagyaa?",
  "Tu bolti hai na, lagta hai knowledge ne bhi crush aaya che."
];

const instructions = [
  "Welcome to the Memory Game!",
  "",
  "Flip two cards at a time to find matching pairs.",
  "Match all 8 pairs to win the game.",
  "Click 'Start Game' when you're ready!"
];

let currentLine = 0;
let currentChar = 0;

function typeLine() {
  if (currentLine >= instructions.length) {
    startBtn.style.display = 'inline-block';
    return;
  }

  const line = instructions[currentLine];
  if (currentChar < line.length) {
    instructionDiv.textContent += line[currentChar];
    typingSound.currentTime = 0;
    typingSound.play().catch(() => {});
    currentChar++;
    setTimeout(typeLine, 40);
  } else {
    instructionDiv.textContent += '\n';
    currentLine++;
    currentChar = 0;
    setTimeout(typeLine, 400);
  }
}

function showMatchPopup() {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  matchMessage.textContent = randomMessage;
  clearTimeout(popupTimeout);
  matchPopup.classList.add('show');
  popupTimeout = setTimeout(() => {
    matchPopup.classList.remove('show');
  }, 4000);
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function getSymbols() {
  return ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8'];
}

function preloadImages() {
  const symbols = getSymbols();
  const allImages = [...symbols, ...symbols];

  allImages.forEach(symbol => {
    const img = new Image();
    img.src = `images/${symbol}.png`;
  });

  const back = new Image();
  back.src = 'images/back.png';
}

function createBoard() {
  const symbols = getSymbols();
  const boardSymbols = shuffle([...symbols, ...symbols]);
  matchedPairs = 0;
  moves = 0;
  lockBoard = false;
  firstCard = null;
  secondCard = null;

  gameBoard.innerHTML = '';
  movesDisplay.textContent = `Moves: 0`;

  boardSymbols.forEach(symbol => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="inner-card">
        <div class="front" style="background-image: url('images/back.png')"></div>
        <div class="back" style="background-image: url('images/${symbol}.png')"></div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains('flipped') ||
    matchPopup.classList.contains('show') // 👈 prevent clicking during popup
  ) return;

  card.classList.add('flipped');
  flipSound.currentTime = 0;
  flipSound.play();

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  setTimeout(() => {
    checkMatch();
  }, 500);
}


function checkMatch() {
  const img1 = firstCard.querySelector('.back').style.backgroundImage;
  const img2 = secondCard.querySelector('.back').style.backgroundImage;
  const isMatch = img1 === img2;

  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;

  if (isMatch) {
    correctSound.currentTime = 0;
    correctSound.play();
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;

    if (matchedPairs < totalPairs) {
      showMatchPopup();
    }

    resetCards();

    if (matchedPairs === totalPairs) {
      finalMoves.textContent = moves;
      setTimeout(() => {
        launchConfetti();
        winModal.classList.add('show');
        bgMusic.pause();
      }, 600);
    }
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play();
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetCards();
    }, 800);
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  preloadImages();
  typeLine();

  window.addEventListener('click', () => {
    bgMusic.play().catch(() => {});
    flipSound.load();
    correctSound.load();
    incorrectSound.load();
  }, { once: true });
});

startBtn.addEventListener('click', () => {
  startModal.classList.remove('show');
  startModal.style.display = 'none';
  createBoard();
  bgMusic.play();
});

restartBtn.addEventListener('click', () => {
  createBoard();
  bgMusic.play();
});

continueBtn.addEventListener('click', () => {
  window.location.href = 'next.html';
});
