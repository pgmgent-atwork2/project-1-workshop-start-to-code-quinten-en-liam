export function startGame() {
  initGame();
}

function resetGame() {
  location.reload();
}

function GameOver() {
  
}

function GameWin() {
  alert("You Win!");
}

async function initGame() {
  const $hint = document.getElementById("hint");
  const wordList = await fetchWordList();

  $hint.innerHTML = wordList.hint;
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
      checkWin(word);

      console.log(word);

      if (!isInWord) {
        count++;
        $lives.innerHTML = `<p>${count} / 6 </p>`;

        drawHangman(count);
        if (count === 6) {
          GameOver();
        }

        if (!checkDuplicateLetter(formatedLetter, word)) {
          $key.ariaDisabled = true;
          $key.disabled = true;
        }
      }

      if (isInWord) {
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
    GameWin();
  }
}

function splitWord(word) {
  return word.split("");
}
