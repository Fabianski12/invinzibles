// Controlla se l'utente è loggato
function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

// Carica i preferiti dal localStorage
function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Salva i preferiti nel localStorage
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Aggiorna il contatore dei preferiti
function updateFavoritesCounter() {
    const counter = document.getElementById('favoritesCounter');
    if (counter) {
        const count = getFavorites().length;
        counter.textContent = count;
        counter.style.display = count > 0 ? 'inline' : 'none';
    }
}

// Aggiungi o rimuovi un drink dai preferiti
function toggleFavorite(drinkName, imgSrc) {
    if (!isUserLoggedIn()) {
        showNotification('Devi effettuare il login per salvare i drink preferiti');
        return false;
    }

    let favorites = getFavorites();
    const index = favorites.findIndex(drink => drink.name === drinkName);

    if (index === -1) {
        favorites.push({ name: drinkName, image: imgSrc });
        saveFavorites(favorites);
        updateFavoritesCounter();
        showNotification(`Hai aggiunto "${drinkName}" ai preferiti!`, true);
        return true;
    } else {
        favorites.splice(index, 1);
        saveFavorites(favorites);
        updateFavoritesCounter();
        showNotification(`Hai rimosso "${drinkName}" dai preferiti!`, false);
        return false;
    }
}

// Aggiorna l'icona del preferito
function updateFavoriteIcon(element, isFavorite) {
    const icon = element.querySelector('i');
    if (isFavorite) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        element.classList.add('active');
    } else {
        icon.classList.add('far');
        icon.classList.remove('fas');
        element.classList.remove('active');
    }
}

// Inizializza gli eventi per i preferiti nella pagina index
function initializeFavorites() {
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    const favorites = getFavorites();
    
    updateFavoritesCounter();

    favoriteIcons.forEach(icon => {
        const card = icon.closest('.card');
        const drinkName = card.querySelector('.card-title').textContent;
        const imgSrc = card.querySelector('.card-img-top').src;

        // Imposta lo stato iniziale
        const isFavorite = favorites.some(drink => drink.name === drinkName);
        updateFavoriteIcon(icon, isFavorite);

        // Aggiungi l'evento click
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const isNowFavorite = toggleFavorite(drinkName, imgSrc);
            updateFavoriteIcon(icon, isNowFavorite);
        });
    });
}

// Carica i preferiti nella pagina preferiti
function loadFavorites() {
    const container = document.getElementById('favoriteDrinksContainer');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    const favorites = getFavorites();

    if (!isUserLoggedIn()) {
        noFavoritesMessage.style.display = 'block';
        noFavoritesMessage.innerHTML = `
            <p style="color: #d5ab30; font-size: 1.2rem;">Effettua il login per vedere i tuoi drink preferiti!</p>
            <a href="login.html" class="btn btn-outline-warning mt-3">Accedi</a>
        `;
        return;
    }

    if (favorites.length === 0) {
        noFavoritesMessage.style.display = 'block';
        return;
    }

    container.innerHTML = favorites.map(drink => `
        <div class="col-6 col-md-2 col-lg-2 drink-item" data-name="${drink.name.toLowerCase()}">
            <div class="card text-center" style="background-color: #d5ab30;">
                <div class="favorite-icon active">
                    <i class="fas fa-heart"></i>
                </div>
                <img class="card-img-top" src="${drink.image}" alt="${drink.name}">
                <div class="card-body">
                    <h5 class="card-title">${drink.name}</h5>
                </div>
            </div>
        </div>
    `).join('');

    // Aggiungi gli eventi per rimuovere dai preferiti
    const favoriteIcons = container.querySelectorAll('.favorite-icon');
    favoriteIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Previene il click sulla card
            const card = icon.closest('.drink-item');
            const drinkName = card.querySelector('.card-title').textContent;
            toggleFavorite(drinkName);
            card.remove();
            
            if (getFavorites().length === 0) {
                noFavoritesMessage.style.display = 'block';
            }
        });
    });

    // Aggiungi gli eventi di click per la navigazione alle pagine di descrizione
    const cards = container.querySelectorAll('.card');
    console.log(`Trovate ${cards.length} card da configurare`);
    
    cards.forEach(card => {
        card.addEventListener('click', function(event) {
            console.log('Card cliccata');
            // Verifica che il click non sia sull'icona dei preferiti
            if (!event.target.closest('.favorite-icon')) {
                const drinkName = this.querySelector('.card-title').textContent;
                console.log(`Drink cliccato: ${drinkName}`);
                // Cerca l'ID del drink dall'API
                searchDrinkIdByName(drinkName);
            }
        });
    });
}

// Funzione per cercare l'ID del drink dall'API
async function searchDrinkIdByName(drinkName) {
    console.log(`Cercando drink: ${drinkName}`);
    
    // Gestione dei drink salvati localmente
    const localDrinks = {
        'Negroni': 'negroni.html',
        'Margarita': 'margarita.html',
        'Sex on the Beach': 'sexonthebeach.html',
        'Long Island': 'longisland.html'
    };

    // Controlla se il drink è uno di quelli salvati localmente
    if (localDrinks[drinkName]) {
        console.log(`Drink locale trovato: ${drinkName}, reindirizzamento a ${localDrinks[drinkName]}`);
        window.location.href = localDrinks[drinkName];
        return;
    }

    // Per gli altri drink, cerca nell'API
    try {
        console.log(`Cercando drink nell'API: ${drinkName}`);
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkName)}`);
        const data = await response.json();
        
        if (data.drinks && data.drinks.length > 0) {
            const drinkId = data.drinks[0].idDrink;
            console.log(`Drink trovato nell'API: ${drinkName} con ID ${drinkId}`);
            window.location.href = `drink.html?id=${encodeURIComponent(drinkId)}`;
        } else {
            // Se non troviamo il drink nell'API, mostriamo un messaggio
            console.log(`Drink non trovato nell'API: ${drinkName}`);
            showNotification(`Impossibile trovare i dettagli per "${drinkName}"`);
        }
    } catch (error) {
        console.error("Errore nella ricerca del drink:", error);
        showNotification("Si è verificato un errore durante la ricerca del drink");
    }
}

// Inizializza la pagina appropriata
if (window.location.pathname.includes('preferiti.html')) {
    loadFavorites();
} else {
    document.addEventListener('DOMContentLoaded', initializeFavorites);
}

// Funzione per mostrare la notifica
function showNotification(message, isAdded) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.backgroundColor = isAdded ? '#d5ab30' : '#ff3b30'; // Colore verde per aggiunta, rosso per rimozione

    // Nascondi il pop-up dopo 3 secondi
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
} 