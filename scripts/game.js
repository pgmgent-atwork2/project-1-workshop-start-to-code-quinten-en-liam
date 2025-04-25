export function startGame() {
  initGame();
}

function GameOver() {
  alert("Game Over!");
}

async function initGame() {
  const wordList = await fetchWordList();

  buildWord(wordList.word);
  drawHangman(0);
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
  let count = 0;
  const $keyboardKey = document.querySelectorAll(".keyboard__key");

  $keyboardKey.forEach(($key) => {
    $key.addEventListener("click", () => {
      const $lives = document.getElementById("lives");
      const letter = $key.innerHTML;
      const formatedLetter = letter.toLowerCase();
      const isInWord = checkLetter(formatedLetter, word);

      if (!isInWord) {
        count++;
        $lives.innerHTML = `<p>${count} / 6 </p>`;

        drawHangman(count);
        if (count === 6) {
          GameOver();
        }
        $key.ariaDisabled = true;
        $key.disabled = true;
      }

      if (isInWord) {
        const $letter = document.getElementById(
          `letter-${word.indexOf(formatedLetter)}`
        );
        $letter.innerHTML = formatedLetter;
      }
    });
  });
}

function drawHangman(count) {
  const $hangman = document.getElementById("hangman-img");

  $hangman.innerHTML = ` <img src="./images/hangman-${count}.svg" alt="Hangman ${count}" />`;
}

function checkLetter(letter, word) {
  return word.includes(letter);
}

function splitWord(word) {
  return word.split("");
}
