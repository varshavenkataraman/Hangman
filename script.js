document.addEventListener("DOMContentLoaded", () => {
  let selectedWord = '';
  let hint = '';
  let guessedLetters = [];
  let wrongGuesses = [];
  let incorrectGuessCount = 0;

  const bodyParts = ["head", "torso", "left-arm", "right-arm", "left-leg", "right-leg"];

  const wordBank = [
    { word: "banana", hint: "A yellow fruit" },
    { word: "elephant", hint: "Largest land animal" },
    { word: "guitar", hint: "A musical instrument with strings" },
    { word: "javascript", hint: "Popular scripting language for the web" }
  ];

  function resetHangmanDrawing() {
    bodyParts.forEach(id => {
      const part = document.getElementById(id);
      if (part) part.style.display = "none";
    });
    incorrectGuessCount = 0;
  }

  window.showTwoPlayerInputs = function () {
    document.getElementById("mode-selection").style.display = "none";
    document.getElementById("player1-inputs").style.display = "flex";
  };

  window.startSinglePlayer = function () {
    const random = wordBank[Math.floor(Math.random() * wordBank.length)];
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

  // Handle key presses
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

  // Info icon toggle
  document.getElementById("info-icon").addEventListener("click", () => {
    const box = document.getElementById("rules-box");
    box.style.display = box.style.display === "block" ? "none" : "block";
  });

  // Close rules box on outside click
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

  // Close rules box on Escape
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
