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

export function startGame() {
  initGame();
}

function buildWord(word) {
  const $word = document.getElementById("word");

  const splittedWord = splitWord(word);

  splittedWord.forEach((letter, i) => {
    $word.innerHTML += `
     <li class="letter" id="letter-${i}">_</li>
    `;
  });
}

function splitWord(word) {
  return word.split("");
}
