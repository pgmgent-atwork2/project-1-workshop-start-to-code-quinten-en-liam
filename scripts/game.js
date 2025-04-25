export function startGame() {
  initGame();
}

async function initGame() {
  const wordList = await fetchWordList();

  buildWord(wordList.word);
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
      const letter = $key.innerHTML;

      const formatedLetter = letter.toLowerCase();

      const isInWord = checkLetter(formatedLetter, word);

      if (!isInWord) {
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

function checkLetter(letter, word) {
  return word.includes(letter);
}

function splitWord(word) {
  return word.split("");
}
