// Funzione per caricare i drink dall'API
async function loadAllDrinks() {
    const apiDrinks = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail")
        .then(response => response.json())
        .then(data => data.drinks.map(drink => ({
            name: drink.strDrink,
            image: drink.strDrinkThumb
        })));

    // Combina i drink locali con quelli dell'API
    const localDrinks = [
        { name: 'Negroni', image: 'Negroni_cocktail.jpg' },
        { name: 'Margarita', image: 'margarita.jpg' },
        { name: 'Long Island', image: 'long island.jpg' },
        { name: 'Sex on the Beach', image: 'sexonthebeach.jpg' }
    ];

    return [...localDrinks, ...apiDrinks];
}

let allDrinks = [];
let currentPlayer = '';
let score = 0;
let timer;
let correctDrink;
let timeLeft;
let sessionScores = [];

// Elementi DOM
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const playerNameInput = document.getElementById('player-name');
const startButton = document.getElementById('start-game');
const playerDisplay = document.getElementById('player-display');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const targetDrinkDisplay = document.getElementById('target-drink');
const drinksGrid = document.querySelector('.drinks-grid');
const leaderboardList = document.getElementById('leaderboard-list');

// Event Listeners
startButton.addEventListener('click', startGame);

async function startGame() {
    // Carica tutti i drink se non sono già stati caricati
    if (allDrinks.length === 0) {
        welcomeScreen.innerHTML += '<div class="loading">Caricamento drink...</div>';
        try {
            allDrinks = await loadAllDrinks();
            welcomeScreen.querySelector('.loading')?.remove();
        } catch (error) {
            console.error('Errore nel caricamento dei drink:', error);
            alert('Errore nel caricamento dei drink. Riprova.');
            return;
        }
    }

    // Inizializza il gioco
    currentPlayer = playerNameInput.value.trim();
    score = 0;
    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";
    playerDisplay.textContent = currentPlayer;
    scoreDisplay.textContent = score;
    
    if (timer) clearInterval(timer);
    startNewRound();
}

function startNewRound() {
    if (timer) clearInterval(timer);
    
    resultScreen.style.display = 'none';
    timeLeft = 15;
    updateTimer();
    timeDisplay.parentElement.classList.remove('urgent');

    const roundDrinks = getRandomDrinks(4);
    correctDrink = roundDrinks[Math.floor(Math.random() * 4)];
    targetDrinkDisplay.textContent = correctDrink.name;

    displayDrinks(roundDrinks);

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 5) {
            timeDisplay.parentElement.classList.add('urgent');
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            saveScore();
            showGameOver();
        }
    }, 1000);
}

function getRandomDrinks(count) {
    const shuffled = [...allDrinks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayDrinks(drinksList) {
    drinksGrid.innerHTML = '';
    drinksList.forEach(drink => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `<img src="${drink.image}" alt="${drink.name}">`;
        card.addEventListener('click', () => checkAnswer(drink, card));
        drinksGrid.appendChild(card);
    });
}

function checkAnswer(selectedDrink, selectedCard) {
    clearInterval(timer);
    const isCorrect = selectedDrink.name === correctDrink.name;
    
    selectedCard.classList.add(isCorrect ? 'correct' : 'wrong');
    
    const allCards = document.querySelectorAll('.game-card');
    allCards.forEach(card => {
        if (card !== selectedCard) {
            if (card.querySelector('img').alt === correctDrink.name) {
                card.classList.add('correct');
            } else {
                card.classList.add('wrong');
            }
        }
    });

    if (isCorrect) {
        score++;
        scoreDisplay.textContent = score;
        setTimeout(() => startNewRound(), 1000);
    } else {
        setTimeout(() => {
            saveScore();
            showGameOver();
        }, 1000);
    }
}

function showGameOver() {
    const resultMessage = document.getElementById('result-message');
    const correctDrinkName = document.getElementById('correct-drink');
    const resultIcon = document.getElementById('result-icon');
    
    resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    resultIcon.className = 'result-icon wrong';
    
    resultMessage.textContent = 'Game Over!';
    resultMessage.className = 'result-message wrong';
    
    correctDrinkName.textContent = correctDrink.name;
    
    document.querySelector('.result-buttons').innerHTML = `
        <button id="new-game" onclick="restartGame()">Nuova Partita</button>
        <button id="back-to-menu" onclick="backToMenu()">Torna al Menu</button>
    `;
    
    resultScreen.style.display = 'flex';
}

function restartGame() {
    if (timer) clearInterval(timer);
    
    // Resetta il punteggio e il timer
    score = 0;
    timeLeft = 15;
    
    // Aggiorna i display
    scoreDisplay.textContent = '0';
    timeDisplay.textContent = '15';
    
    // Nascondi la schermata di risultato
    resultScreen.style.display = 'none';
    
    // Inizia una nuova partita
    startNewRound();
}

function backToMenu() {
    if (timer) clearInterval(timer);
    
    // Resetta tutte le variabili di gioco
    score = 0;
    timeLeft = 15;
    allDrinks = []; // Forza il ricaricamento dei drink
    
    // Aggiorna i display
    scoreDisplay.textContent = '0';
    timeDisplay.textContent = '15';
    
    // Nascondi le schermate di gioco e risultato
    gameScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    
    // Mostra la schermata iniziale
    welcomeScreen.style.display = 'block';
    
    // Pulisci il campo del nome
    playerNameInput.value = '';
    playerDisplay.textContent = '';
    
    // Rimuovi le classi dalle carte
    const allCards = document.querySelectorAll('.game-card');
    allCards.forEach(card => {
        card.classList.remove('correct', 'wrong');
    });
    //ricarica la pagina
    location.reload();
}

// Funzione per aggiornare il timer
function updateTimer() {
    timeDisplay.textContent = timeLeft;
}

// Funzione per salvare il punteggio
function saveScore() {
    if (score > 0) {
        sessionScores.push({
            name: currentPlayer,
            score: score,
            date: new Date().toLocaleTimeString()
        });
        sessionScores.sort((a, b) => b.score - a.score);
        updateLeaderboard();
    }
}

// Funzione per aggiornare la classifica
function updateLeaderboard() {
    leaderboardList.innerHTML = sessionScores
        .map((entry, index) => `
            <div class="leaderboard-item">
                <div class="leaderboard-info">
                    <span class="position">${index + 1}.</span>
                    <span class="player-name">${entry.name}</span>
                </div>
                <div class="score-info">
                    <span class="score">${entry.score} punti</span>
                    <span class="time">${entry.date}</span>
                </div>
            </div>
        `)
        .join('');
}

// Aggiungi l'evento per il pulsante "Gioca"
document.getElementById("start-game").addEventListener("click", function() {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        currentPlayer = playerName;
        playerDisplay.textContent = currentPlayer;
        welcomeScreen.style.display = "none";
        gameScreen.style.display = "block";
        startGame();
    } else {
        alert("Per favore, inserisci il tuo nome!");
    }
}); 