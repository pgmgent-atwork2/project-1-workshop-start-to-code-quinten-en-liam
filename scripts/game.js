const $overlay = document.getElementById("overlay");
const $modal = document.getElementById("modal");
const $modalTitle = document.getElementById("modal-title");
const $modalMessage = document.getElementById("modal-message");
// houd het aantal fouten bij
let count = 0;

export function startGame() {
  initGame();
}

function resetGame() {
  location.reload();
}

function gameOver(word) {
  $overlay.classList.add("active");
  $modal.classList.remove("hide");
  $modalTitle.innerHTML = "Game Over";
  $modalMessage.innerHTML = `Je bent verloren, uw woord was <span class="lose">${word.join(
    ""
  )}</span>`;
}

function gameWin(word) {
  $overlay.classList.add("active");
  $modal.classList.remove("hide");
  $modalTitle.innerHTML = "You won!";
  $modalMessage.innerHTML = `je hebt het juist woord geraden! <span class="win">${word.join(
    ""
  )}</span>`;
}

async function initGame() {
  const $hint = document.getElementById("hint");
  // haalt de woordenlijst op
  const wordList = await fetchWordList();

  $hint.innerHTML = wordList.hint;
  buildWord(wordList.word);

  drawHangman(0);

  const $playAgain = document.getElementById("play-again");
  $playAgain.addEventListener("click", () => {
    resetGame();
  });
}

// haalt de woordenlijst op van een json bestand
// en geeft een random woord terug
async function fetchWordList() {
  const response = await fetch("./scripts/list.json");

  const data = await response.json();

  return getRandomWord(data);
}

// haalt een random woord uit de woordenlijst
function getRandomWord(wordList) {
  const i = Math.floor(Math.random() * wordList.length);
  const randomWord = wordList[i];

  return randomWord;
}

function buildWord(word) {
  const $word = document.getElementById("word");

  // split het woord in letters
  const splittedWord = splitWord(word);

  // voegt het aantal _'s op basis van het aantal letters in het woord
  splittedWord.forEach((letter, i) => {
    $word.innerHTML += `
     <li class="letter" id="letter-${i}">_</li>
    `;
  });

  keyboard(splittedWord);
}

function keyboard(word) {
  const $keyboardKey = document.querySelectorAll(".keyboard__key");

  // heeft het geclickte letter door
  $keyboardKey.forEach(($key) => {
    $key.addEventListener("click", () => {
      handleGuess($key, word);
    });
  });

  // heeft het letter door als je op de toets drukt
  document.addEventListener("keydown", (e) => {
    const keyPressed = document.getElementById(`key-${e.key}`);

    if (!keyPressed) return;
    if (keyPressed.ariaDisabled) return;

    handleGuess(keyPressed, word);
  });
}

function handleGuess($key, word) {
  const $lives = document.getElementById("lives");
  const letter = $key.innerHTML;
  const formatedLetter = letter.toLowerCase();
  const isInWord = checkLetter(formatedLetter, word);
  checkWin(word);

  // checkt ofdat de letter in het woord zit
  if (!isInWord) {
    // als de letter niet in het woord zit, dan wordt de count met 1 verhoogd en de hangman opnieuw getekend op basis van count
    count++;
    $lives.innerHTML = `<p>${count} / 6 keuzes</p>`;
    drawHangman(count);

    // als de count 6 is, dan is het spel afgelopen
    if (count === 6) {
      gameOver(word);
    }
  }

  // als de letter in het woord zit, dan wordt de letter toegevoegd aan de lijst
  if (isInWord) {
    addWordToList(formatedLetter, word, $key);
  } else {
    $key.ariaDisabled = true;
    $key.disabled = true;
  }
}

// Deze functie voegt de letter toe aan de lijst
function addWordToList(formatedLetter, word, $key) {
  // checkt ofdat de letter meer dan 1 keer in het woord zit
  // als dat zo is, dan worden de letters toegevoegd aan de lijst
  if (checkDuplicateLetter(formatedLetter, word)) {
    let duplicatedIndex = [];
    word.forEach((l, i) => {
      if (l === formatedLetter) {
        duplicatedIndex.push(i);
      }
    });

    // de letters worden toegevoegd aan de lijst en de key wordt disabled
    duplicatedIndex.forEach((i) => {
      const $letter = document.getElementById(`letter-${i}`);
      $letter.innerHTML = formatedLetter;
      $key.ariaDisabled = true;
      $key.disabled = true;
    });

    checkWin(word);
  }

  // als de letter maar 1 keer in het woord zit, dan wordt de letter toegevoegd aan de lijst
  // en de key wordt disabled
  if (!checkDuplicateLetter(formatedLetter, word)) {
    const $letter = document.getElementById(
      `letter-${word.indexOf(formatedLetter)}`
    );
    $letter.innerHTML = formatedLetter;
    $key.ariaDisabled = true;
    $key.disabled = true;

    checkWin(word);
  }
}

// Deze functie tekent de hangman op basis van het aantal fouten
function drawHangman(count) {
  const $hangman = document.getElementById("hangman-img");
  $hangman.innerHTML = ` <img src="./images/hangman-${count}.svg" alt="Hangman ${count}" />`;
}

// kijkt ofdat de letter in het woord zit
function checkLetter(letter, word) {
  return word.includes(letter);
}

// kijkt ofdat er een letter meer dan 1 keer in het woord zit
function checkDuplicateLetter(letter, word) {
  return word.filter((l) => l === letter).length > 1;
}

function checkWin(word) {
  // Maakt een lege lijst aan
  let count = [];
  const $letters = document.querySelectorAll(".letter");

  // Loopt door de letters heen en voegt ze toe aan de lijst
  $letters.forEach(($letter) => {
    count.push($letter.innerHTML.toLowerCase());
  });

  // checkt ofdat alle letters in de lijst zitten - ja = true
  if (word.every((l) => count.includes(l))) {
    // Als dat zo is, dan is het spel gewonnen
    gameWin(word);
  }
}

// Deze functie splist een woord in letters bv "test" => ["t", "e", "s", "t"]
function splitWord(word) {
  return word.split("");
}
