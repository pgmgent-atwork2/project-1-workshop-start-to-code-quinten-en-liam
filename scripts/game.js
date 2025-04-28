const $overlay = document.getElementById("overlay");
const $modal = document.getElementById("modal");
const $modalTitle = document.getElementById("modal-title");
const $modalMessage = document.getElementById("modal-message");
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
  const wordList = await fetchWordList();

  $hint.innerHTML = wordList.hint;
  buildWord(wordList.word);

  drawHangman(0);

  const $playAgain = document.getElementById("play-again");
  $playAgain.addEventListener("click", () => {
    resetGame();
  });
}

async function fetchWordList() {
  const response = await fetch("./scripts/list.json");

  const data = await response.json();

  return getRandomWord(data);
}

function getRandomWord(wordList) {
  const i = Math.floor(Math.random() * wordList.length);
  const randomWord = wordList[i];

  return randomWord;
}

function buildWord(word) {
  const $word = document.getElementById("word");

  const splittedWord = splitWord(word);

  splittedWord.forEach((letter, i) => {
    $word.innerHTML += `
     <li class="letter" id="letter-${i}">_</li>
    `;
  });

  keyboard(splittedWord);
}

function keyboard(word) {
  const $keyboardKey = document.querySelectorAll(".keyboard__key");

  $keyboardKey.forEach(($key) => {
    $key.addEventListener("click", () => {
      handleKeyboardKeys($key, word);
    });
  });

  document.addEventListener("keydown", (e) => {
    const keyPressed = document.getElementById(`key-${e.key}`);

    if (!keyPressed) return;
    if (keyPressed.ariaDisabled) return;

    handleKeyboardKeys(keyPressed, word);
  });
}

function handleKeyboardKeys($key, word) {
  const $lives = document.getElementById("lives");
  const letter = $key.innerHTML;
  const formatedLetter = letter.toLowerCase();
  const isInWord = checkLetter(formatedLetter, word);
  checkWin(word);

  if (!isInWord) {
    count++;
    $lives.innerHTML = `<p>${count} / 6 keuzes</p>`;

    drawHangman(count);

    if (count === 6) {
      gameOver(word);
    }
  }

  if (isInWord) {
    addWordToList(formatedLetter, word, $key);
  } else {
    $key.ariaDisabled = true;
    $key.disabled = true;
  }
}

function addWordToList(formatedLetter, word, $key) {
  if (checkDuplicateLetter(formatedLetter, word)) {
    let duplicatedIndex = [];
    word.forEach((l, i) => {
      if (l === formatedLetter) {
        duplicatedIndex.push(i);
      }
    });

    duplicatedIndex.forEach((i) => {
      const $letter = document.getElementById(`letter-${i}`);
      $letter.innerHTML = formatedLetter;
      $key.ariaDisabled = true;
      $key.disabled = true;
    });

    checkWin(word);
  }

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

function drawHangman(count) {
  const $hangman = document.getElementById("hangman-img");

  $hangman.innerHTML = ` <img src="./images/hangman-${count}.svg" alt="Hangman ${count}" />`;
}

function checkLetter(letter, word) {
  return word.includes(letter);
}

function checkDuplicateLetter(letter, word) {
  return word.filter((l) => l === letter).length > 1;
}

function checkWin(word) {
  let count = [];
  const $letters = document.querySelectorAll(".letter");

  $letters.forEach(($letter) => {
    count.push($letter.innerHTML.toLowerCase());
  });

  if (word.every((l) => count.includes(l))) {
    gameWin(word);
  }
}

function splitWord(word) {
  return word.split("");
}
