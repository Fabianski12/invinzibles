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
  const notificationContainer = document.getElementById("notification");
  const timerContainer = document.createElement("div");

  timerContainer.id = "timer-container";
  currentDrinkDisplay.parentElement.insertBefore(timerContainer, currentDrinkDisplay.nextSibling);

  let currentDrink = null;
  let score = 0;
  let timerInterval;

  function loadScoreboard() {
    const scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
    scoreList.innerHTML = "";
    scoreboard.forEach(entry => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.name}: ${entry.score} punti`;
      scoreList.appendChild(listItem);
    });
  }

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

  function resetGame() {
    const username = sessionStorage.getItem("username");
    saveScoreboard(username, score);
    showNotification("Hai perso! Il gioco è stato resettato.", "error");
    score = 0;
    currentDrink = null;
    usernameInput.disabled = false;
    startButton.disabled = false;
    optionsContainer.innerHTML = "";
    currentDrinkDisplay.textContent = "";
    clearTimer();
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
    loadScoreboard();
  }

  function startTimer() {
    const totalDuration = 4;
    let timeLeft = totalDuration;

    timerContainer.innerHTML = `
      <svg id="timer-circle" width="100" height="100">
        <circle class="background" cx="50" cy="50" r="50" stroke="#ddd" stroke-width="10" fill="none"></circle>
        <circle class="progress" cx="50" cy="50" r="50" stroke="red" stroke-width="10" fill="none"
          stroke-dasharray="${2 * Math.PI * 50}" stroke-dashoffset="0"></circle>
      </svg>
      <div id="timer-text" style="position: absolute; top: 35%; left: 35%; font-size: 20px; font-weight: bold;">${timeLeft}</div>
    `;

    const progressCircle = timerContainer.querySelector(".progress");
    const timerText = timerContainer.querySelector("#timer-text");
    const circumference = 2 * Math.PI * 50;

    progressCircle.style.transition = `stroke-dashoffset ${totalDuration}s linear`;
    progressCircle.style.strokeDashoffset = 0;

    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showNotification("Tempo scaduto! Game Over.", "error");
        resetGame();
      }
    }, 1000);

    setTimeout(() => {
      progressCircle.style.strokeDashoffset = circumference;
    }, 0);
  }

  function clearTimer() {
    clearInterval(timerInterval);
    timerContainer.innerHTML = "";
  }

  function generateDrink() {
    clearTimer();
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
      img.addEventListener("click", () => {
        clearTimer();
        handleChoice(drink.name);
      });
      option.appendChild(img);
      optionsContainer.appendChild(option);
    });

    startTimer();
  }

  function handleChoice(selectedDrink) {
    const username = sessionStorage.getItem("username");
    if (selectedDrink === currentDrink.name) {
      score++;
      showNotification("Corretto! Punteggio aumentato.", "success");
      generateDrink();
    } else {
      saveScoreboard(username, score);
      resetGame();
    }
  }

  function showNotification(message, type) {
    notificationContainer.textContent = message;
    notificationContainer.style.display = "block";

    if (type === "success") {
      notificationContainer.style.backgroundColor = "#4caf50";
    } else if (type === "error") {
      notificationContainer.style.backgroundColor = "#f44336";
    }

    setTimeout(() => {
      notificationContainer.style.display = "none";
    }, 2000);
  }

  loadScoreboard();
});
