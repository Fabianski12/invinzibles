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
  const notificationContainer = document.getElementById("notification"); // Contenitore per notifiche

  let currentDrink = null;
  let score = 0;

  // Funzione per caricare la classifica dal LocalStorage
  function loadScoreboard() {
    const scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
    scoreList.innerHTML = "";
    scoreboard.forEach(entry => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.name}: ${entry.score} punti`;
      scoreList.appendChild(listItem);
    });
  }

  // Funzione per salvare il punteggio nella classifica
  function saveScoreboard(username, newScore) {
    const scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
    const existingPlayer = scoreboard.find(entry => entry.name === username);

    if (existingPlayer) {
      existingPlayer.score = Math.max(existingPlayer.score, newScore);
    } else {
      scoreboard.push({ name: username, score: newScore });
    }

    scoreboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
    loadScoreboard();
  }

  // Funzione per resettare il gioco
  function resetGame() {
    const username = sessionStorage.getItem("username");
    saveScoreboard(username, score); // Salva il punteggio finale
    showNotification("Hai perso! Il gioco è stato resettato.", "error"); // Notifica di sconfitta
    score = 0;
    currentDrink = null;
    usernameInput.disabled = false;
    startButton.disabled = false;
    optionsContainer.innerHTML = "";
    currentDrinkDisplay.textContent = "";
  }

  // Quando si preme il pulsante "Start"
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

  // Funzione per inizializzare il gioco
  function initializeGame() {
    generateDrink();
    loadScoreboard();
  }

  // Funzione per generare un nuovo drink
  function generateDrink() {
    optionsContainer.innerHTML = "";
    const randomIndex = Math.floor(Math.random() * drinks.length);
    currentDrink = drinks[randomIndex];
    currentDrinkDisplay.textContent = `Indovina: ${currentDrink.name}`;

    const otherDrinks = drinks.filter(drink => drink.name !== currentDrink.name);
    const shuffledOthers = otherDrinks.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffledOthers, currentDrink].sort(() => Math.random() - 0.5);

    options.forEach(drink => {
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

  // Funzione per gestire la scelta
  function handleChoice(selectedDrink) {
    const username = sessionStorage.getItem("username");
    if (selectedDrink === currentDrink.name) {
      score++;
      showNotification("Corretto! Punteggio aumentato.", "success");
      generateDrink();
    } else {
      saveScoreboard(username, score); // Salva il punteggio prima di resettare
      resetGame();
    }
  }

  // Funzione per mostrare una notifica temporanea
  function showNotification(message, type) {
    notificationContainer.textContent = message;
    notificationContainer.style.display = "block";

    if (type === "success") {
      notificationContainer.style.backgroundColor = "#4caf50"; // Verde per successo
    } else if (type === "error") {
      notificationContainer.style.backgroundColor = "#f44336"; // Rosso per errore
    }

    setTimeout(() => {
      notificationContainer.style.display = "none";
    }, 2000);
  }

  // Carica la classifica all'avvio della pagina
  loadScoreboard();
});
