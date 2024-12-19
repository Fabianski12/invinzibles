document.addEventListener("DOMContentLoaded", () => {
  const drinks = [
      { name: "Vodka", image: "vodka.jpg" },
      { name: "Gin", image: "gin.webp" },
      { name: "Sambuca", image: "sambuca.jpg" },
      { name: "Amaro del Capo", image: "adc.jpg" },
      { name: "Jager", image: "jager.webp" },
      { name: "Whisky Scozzese", image: "whisky_scozzese.png" },
      { name: "Whisky Irlandese", image: "whisky_irlandese.png" },
      { name: "Whisky Bourbon", image: "whisky_bourbon.png" },
      { name: "Whisky Rye", image: "whisky_rye.png" },
      { name: "Vodka Aromatizzata", image: "vodka_aromatizzata.png" },
      { name: "Gin Old Tom", image: "gin_old_tom.png" },
      { name: "Gin Plymouth", image: "gin_plymouth.png" },
      { name: "Rum Bianco", image: "rum_bianco.png" },
      { name: "Rum Scuro", image: "rum_scuro.png" },
      { name: "Rum Oro", image: "rum_oro.png" },
      { name: "Rum Speziato", image: "rum_speziato.png" },
      { name: "Brandy", image: "brandy.png" },
      { name: "Cognac", image: "cognac.png" },
      { name: "Armagnac", image: "armagnac.png" },
      { name: "Calvados", image: "calvados.png" },
      { name: "Rum Agricole", image: "rum_agricole.png" },
      { name: "Cachaça", image: "cachaca.png" },
      { name: "Amari Fernet", image: "amaro_fernet.png" },
      { name: "Amaro Lucano", image: "amaro_lucano.png" },
      { name: "Amari Averna", image: "amaro_averna.png" },
      { name: "Amari Montenegro", image: "amaro_montenegro.png" },
      { name: "Liquore alla frutta Triple Sec", image: "liquore_triple_sec.png" },
      { name: "Liquore alla frutta Grand Marnier", image: "liquore_grand_marnier.png" },
      { name: "Liquore alla frutta Limoncello", image: "liquore_limoncello.png" },
      { name: "Liquore cremoso Baileys", image: "liquore_bayles.png" },
      { name: "Liquore cremoso Amarula", image: "liquore_amarula.png" },
      { name: "Liquore cremoso Advocaat", image: "liquore_advocaat.png" },
      { name: "Liquore speziato Anice", image: "liquore_anice.png" },
      { name: "Liquore speziato Pastis", image: "liquore_pastis.png" },
      { name: "Vermouth Rosso", image: "vermouth_rosso.png" },
      { name: "Vermouth Bianco", image: "vermouth_bianco.png" },
      { name: "Vermouth Dry", image: "vermouth_dry.png" },
      { name: "Tequila Silver", image: "tequila_silver.png" },
      { name: "Tequila Gold", image: "tequila_gold.png" },
      { name: "Tequila Reposado", image: "tequila_reposado.png" },
      { name: "Tequila Añejo", image: "tequila_anejo.png" },
      { name: "Mezcal", image: "mezcal.png" },
      { name: "Grappa", image: "grappa.png" },
      { name: "Pisco", image: "pisco.png" },
      { name: "Aquavite Scandinavia", image: "aquavite_scandinavia.png" },
      { name: "Raki", image: "raki.png" },
      { name: "Ouzo", image: "ouzo.png" },
      { name: "Tsipouro", image: "tsipouro.png" },
      { name: "Shochu", image: "shochu.png" },
      { name: "Soju", image: "soju.png" },
      { name: "Arrack", image: "arrack.png" },
      { name: "Slivovitz", image: "slivovitz.png" },
      { name: "Palinka", image: "palinka.png" },
      { name: "Kirsch", image: "kirsch.png" },
      { name: "Brennivín", image: "brennivin.png" },
      { name: "Rum Overproof", image: "rum_overproof.png" },
      { name: "Falernum", image: "falernum.png" },
      { name: "Liquore al caffè Kahlúa", image: "kahlùa.png" },
      { name: "Liquore al caffè Tia Maria", image: "tia_maria.png" },
      { name: "Génépi", image: "genepi.png" },
      { name: "Creme de Menthe", image: "creme_de_menthe.png" },
      { name: "Creme de Cacao", image: "creme_de_cacao.png" },
      { name: "Akvavit", image: "akvavit.png" },
      { name: "Grain Whisky", image: "grain_whisky.png" },
      { name: "Moonshine", image: "moonshine.png" },
      { name: "Peppermint Schnapps", image: "peppermint_schnapp.png" },
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
    const totalDuration = 10;
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
  let timerDuration = 10; // Timer duration in seconds
  let timerRemaining = timerDuration;
  
  // Select timer elements
  const timerText = document.getElementById('timer-text');
  const timerCircle = document.getElementById('timer-circle');
  
  function startTimer() {
    const interval = setInterval(() => {
      // Update the timer text
      timerRemaining--;
      timerText.textContent = timerRemaining;
  
      // Update the timer circle (adjusting the gradient)
      const percentage = ((timerDuration - timerRemaining) / timerDuration) * 100;
      timerCircle.style.background = `conic-gradient(
        red 0%,
        yellow ${percentage / 2}%,
        green ${percentage}%,
        transparent ${percentage}%)`;
  
      // Stop the timer at 0
      if (timerRemaining <= 0) {
        clearInterval(interval);
        timerText.textContent = "Tempo Scaduto!";
      }
    }, 1000);
  }
  loadScoreboard();
});
