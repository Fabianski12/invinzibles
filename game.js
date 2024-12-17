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

  // Funzione per resettare il gioco
  function resetGame() {
    showNotification("Hai perso! Il gioco è stato resettato.", "error"); // Notifica di sconfitta
    score = 0;
    sessionStorage.removeItem("username");
    usernameInput.value = "";
    usernameInput.disabled = false;
    startButton.disabled = false;
    optionsContainer.innerHTML = "";
    currentDrinkDisplay.textContent = "";
    scoreList.innerHTML = "";
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
    updateScoreBoard();
  }

  // Funzione per generare un nuovo drink
  function generateDrink() {
    optionsContainer.innerHTML = "";
    const randomIndex = Math.floor(Math.random() * drinks.length);
    currentDrink = drinks[randomIndex];
    currentDrinkDisplay.textContent = `Indovina: ${currentDrink.name}`;

    // Seleziona 4 drink casuali, inclusa la risposta corretta
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
    if (selectedDrink === currentDrink.name) {
      score++;
      showNotification("Corretto! Punteggio aumentato.", "success"); // Notifica di successo
      updateScoreBoard();
      generateDrink();
    } else {
      showNotification("Sbagliato! Game Over.", "error"); // Notifica di sconfitta
      resetGame();
    }
  }

  // Funzione per aggiornare la classifica
  function updateScoreBoard() {
    const username = sessionStorage.getItem("username");
    scoreList.innerHTML = `<li>${username}: ${score} punti</li>`;
  }

  // Funzione per mostrare una notifica temporanea
  function showNotification(message, type) {
    notificationContainer.textContent = message;
    notificationContainer.style.display = "block";

    // Imposta lo stile in base al tipo (successo o errore)
    if (type === "success") {
      notificationContainer.style.backgroundColor = "#4caf50"; // Verde per successo
    } else if (type === "error") {
      notificationContainer.style.backgroundColor = "#f44336"; // Rosso per errore  (non funzionante) (da sistemare)
    }

    // Nasconde la notifica dopo 2 secondi
    setTimeout(() => {
      notificationContainer.style.display = "none";
    }, 2000);
  }
});
