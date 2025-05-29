document.addEventListener("DOMContentLoaded", () => {
  let selectedWord = '';
  let hint = '';
  let guessedLetters = [];
  let wrongGuesses = [];
  let incorrectGuessCount = 0;

  const bodyParts = ["head", "torso", "left-arm", "right-arm", "left-leg", "right-leg"];

  function resetHangmanDrawing() {
    bodyParts.forEach(id => {
      const part = document.getElementById(id);
      if (part) part.style.display = "none";
    });
    incorrectGuessCount = 0;
  }

  async function fetchRandomWordAndHint() {
    try {
      const wordRes = await fetch("https://random-word-api.vercel.app/api?words=1");
      const [word] = await wordRes.json();
      const cleanWord = word.toLowerCase();

      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
      const dictData = await dictRes.json();
      const definition = dictData[0]?.meanings?.[0]?.definitions?.[0]?.definition || "No hint available.";

      return { word: cleanWord, hint: definition };
    } catch (err) {
      console.error("Failed to fetch word/hint:", err);
      return { word: "hangman", hint: "Fallback word: guess it!" };
    }
  }

  window.showTwoPlayerInputs = function () {
    document.getElementById("mode-selection").style.display = "none";
    document.getElementById("player1-inputs").style.display = "flex";
  };

  window.startSinglePlayer = async function () {
    const random = await fetchRandomWordAndHint();
    selectedWord = random.word;
    hint = random.hint;
    guessedLetters = [];
    wrongGuesses = [];
    incorrectGuessCount = 0;

    resetHangmanDrawing();

    document.getElementById("mode-selection").style.display = "none";
    document.getElementById("game-ui").style.display = "flex";
    document.getElementById("hint").innerText = `Hint: ${hint}`;
    document.getElementById("wrong-letters").innerText = '';
    document.getElementById("message").innerText = '';

    createWordDisplay();
    document.getElementById("keyboard").innerHTML = "<p>Type letters using your keyboard.</p>";
  };

  window.startGame = function () {
    const wordInput = document.getElementById("word-input").value.trim().toLowerCase();
    const hintInput = document.getElementById("hint-input").value.trim();

    if (wordInput === '' || hintInput === '') {
      alert("Please enter both a word and a hint.");
      return;
    }

    selectedWord = wordInput;
    hint = hintInput;
    guessedLetters = [];
    wrongGuesses = [];
    incorrectGuessCount = 0;

    resetHangmanDrawing();

    document.getElementById("player1-inputs").style.display = "none";
    document.getElementById("game-ui").style.display = "flex";
    document.getElementById("hint").innerText = `Hint: ${hint}`;
    document.getElementById("wrong-letters").innerText = '';
    document.getElementById("message").innerText = '';

    createWordDisplay();
    document.getElementById("keyboard").innerHTML = "<p>Type letters using your keyboard.</p>";
  };

  function createWordDisplay() {
    const wordDisplay = selectedWord.split('').map(letter =>
      guessedLetters.includes(letter) ? letter : "_"
    ).join(" ");
    document.getElementById("word").innerText = wordDisplay;

    if (!wordDisplay.includes("_")) {
      document.getElementById("message").innerText = "You Win!";
    }
  }

  function handleGuess(letter) {
    if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) return;

    if (selectedWord.includes(letter)) {
      guessedLetters.push(letter);
      createWordDisplay();
    } else {
      wrongGuesses.push(letter);
      document.getElementById("wrong-letters").innerText = wrongGuesses.join(", ");

      if (incorrectGuessCount < bodyParts.length) {
        const partToShow = document.getElementById(bodyParts[incorrectGuessCount]);
        if (partToShow) {
          partToShow.style.display = "block";
        }
        incorrectGuessCount++;
      }

      if (incorrectGuessCount === bodyParts.length) {
        document.getElementById("message").innerText = `You Lose! The word was "${selectedWord}".`;
      }
    }
  }

  window.restartGame = function () {
    selectedWord = '';
    hint = '';
    guessedLetters = [];
    wrongGuesses = [];
    incorrectGuessCount = 0;

    document.getElementById("mode-selection").style.display = "flex";
    document.getElementById("player1-inputs").style.display = "none";
    document.getElementById("game-ui").style.display = "none";
    document.getElementById("word-input").value = "";
    document.getElementById("hint-input").value = "";

    resetHangmanDrawing();
  };

  
  document.addEventListener("keydown", function (event) {
    const message = document.getElementById("message").innerText;
    if (!selectedWord) return;

    if (event.key === "Enter" && message !== '') {
      document.querySelector("button[onclick='restartGame()']").click();
      return;
    }

    if (/^[a-z]$/.test(event.key.toLowerCase()) && message === '') {
      handleGuess(event.key.toLowerCase());
    }
  });

  document.getElementById("hint-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      startGame();
    }
  });

  document.getElementById("word-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      document.getElementById("hint-input").focus();
      event.preventDefault();
    }
  });

  
  document.getElementById("info-icon").addEventListener("click", () => {
    const box = document.getElementById("rules-box");
    box.style.display = box.style.display === "block" ? "none" : "block";
  });

  
  document.addEventListener("click", function (event) {
    const rulesBox = document.getElementById("rules-box");
    const infoIcon = document.getElementById("info-icon");

    if (
      rulesBox.style.display === "block" &&
      !rulesBox.contains(event.target) &&
      !infoIcon.contains(event.target)
    ) {
      rulesBox.style.display = "none";
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const rulesBox = document.getElementById("rules-box");
      if (rulesBox.style.display === "block") {
        rulesBox.style.display = "none";
      }
    }
  });

  resetHangmanDrawing();
});
