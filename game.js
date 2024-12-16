const drinks = [
    { name: "Vodka", image: "vodka.jpg" },
    { name: "Gin", image: "gin.webp" },
    { name: "Sambuca", image: "sambuca.jpg" },
    { name: "Amaro del Capo", image: "adc.jpg" },
    { name: "Jager", image: "Jager.webp"}
  ];
  
  const startButton = document.getElementById("start-game");
  const playerNameInput = document.getElementById("player-name");
  const gameArea = document.querySelector(".game-area");
  const questionElement = document.getElementById("question");
  const optionsButtons = document.querySelectorAll(".option");
  const scoreList = document.getElementById("score-list");
  
  let correctDrink = "";
  let score = 0;
  let playerName = "";
  
  // Inizializza il gioco
  startButton.addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
      alert("Inserisci il tuo nome per iniziare!");
      return;
    }
    startGame();
  });
  
  // Avvia il gioco
  function startGame() {
    gameArea.style.display = "block";
    const randomDrinks = drinks.sort(() => Math.random() - 0.5).slice(0, 4);
    correctDrink = randomDrinks[Math.floor(Math.random() * 4)];
  
    // Mostra le opzioni
    optionsButtons.forEach((button, index) => {
      const img = button.querySelector("img");
      img.src = randomDrinks[index].image;
      img.alt = randomDrinks[index].name;
      button.onclick = () => checkAnswer(randomDrinks[index].name);
    });
  
    questionElement.textContent = "Qual è il drink giusto?";
  }
  
  // Verifica risposta
  function checkAnswer(selectedDrink) {
    if (selectedDrink === correctDrink.name) {
      alert("Corretto!");
      score++;
    } else {
      alert("Sbagliato! Il gioco riparte.");
      score = 0;
    }
    updateScoreboard();
    startGame();
  }
  
  // Aggiorna la classifica
  function updateScoreboard() {
    const scoreEntry = `${playerName}: ${score} punti`;
    const listItem = document.createElement("li");
    listItem.textContent = scoreEntry;
    scoreList.appendChild(listItem);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const drinks = [
      { name: "Vodka", image: "vodka.jpg" },
      { name: "Gin", image: "gin.webp" },
      { name: "Sambuca", image: "sambuca.jpg" },
      { name: "Amaro del Capo", image: "adc.jpg" },
      { name: "Jager", image: "jager.webp" },
    ];
  
    const usernameInput = document.getElementById("username");
    const startButton = document.getElementById("start-game");
    const optionsContainer = document.querySelector(".options");
    const scoreList = document.getElementById("score-list");
    const currentDrinkDisplay = document.getElementById("current-drink");
  
    let currentDrink = null;
    let score = 0;
  
    function resetGame() {
      score = 0;
      sessionStorage.removeItem("username");
      usernameInput.value = "";
      usernameInput.disabled = false;
      startButton.disabled = false;
      optionsContainer.innerHTML = "";
      currentDrinkDisplay.textContent = "";
      scoreList.innerHTML = "";
    }
  
    startButton.addEventListener("click", () => {
      const username = usernameInput.value.trim();
      if (username) {
        sessionStorage.setItem("username", username);
        usernameInput.disabled = true;
        startButton.disabled = true;
        initializeGame();
      } else {
        alert("Inserisci un nome valido!");
      }
    });
  
    function initializeGame() {
      generateDrink();
      updateScoreBoard();
    }
  
    function generateDrink() {
      optionsContainer.innerHTML = "";
      const randomIndex = Math.floor(Math.random() * drinks.length);
      currentDrink = drinks[randomIndex];
      currentDrinkDisplay.textContent = `Indovina: ${currentDrink.name}`;
  
      // Seleziona 4 drink casuali
      const shuffledDrinks = [...drinks].sort(() => Math.random() - 0.5).slice(0, 4);
  
      shuffledDrinks.forEach(drink => {
        const option = document.createElement("div");
        option.classList.add("option");
        const img = document.createElement("img");
        img.src = drink.image;
        img.alt = drink.name;
        img.addEventListener("click", () => handleChoice(drink.name));
        option.appendChild(img);
        optionsContainer.appendChild(option);
      });
    }
  
    function handleChoice(selectedDrink) {
      if (selectedDrink === currentDrink.name) {
        score++;
        alert("Corretto! Punteggio aumentato.");
        updateScoreBoard();
        generateDrink();
      } else {
        alert("Sbagliato! Ripartiamo da capo.");
        resetGame();
      }
    }
  
    function updateScoreBoard() {
      const username = sessionStorage.getItem("username");
      scoreList.innerHTML = `<li>${username}: ${score} punti</li>`;
    }
  });