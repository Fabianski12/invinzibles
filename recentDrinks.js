// Funzione per salvare un drink visualizzato
function saveViewedDrink(drinkName, drinkImage) {
    let recentDrinks = getRecentDrinks();
    
    // Rimuovi il drink se esiste già (per evitare duplicati)
    recentDrinks = recentDrinks.filter(drink => drink.name !== drinkName);
    
    // Aggiungi il nuovo drink all'inizio della lista
    recentDrinks.unshift({ name: drinkName, image: drinkImage });
    
    // Mantieni solo gli ultimi 12 drink visualizzati
    if (recentDrinks.length > 12) {
        recentDrinks = recentDrinks.slice(0, 12);
    }
    
    // Salva nel localStorage
    localStorage.setItem('recentDrinks', JSON.stringify(recentDrinks));
}

// Funzione per ottenere i drink visualizzati recentemente
function getRecentDrinks() {
    return JSON.parse(localStorage.getItem('recentDrinks')) || [];
}

// Funzione per visualizzare i drink recenti nella pagina
function displayRecentDrinks() {
    const container = document.getElementById('recentDrinksContainer');
    const recentDrinks = getRecentDrinks();
    
    if (recentDrinks.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p style="color: #d5ab30; font-size: 1.2rem;">Nessun drink visualizzato recentemente</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentDrinks.map(drink => `
        <div class="col-6 col-md-2 col-lg-2 drink-item" data-name="${drink.name.toLowerCase()}">
            <div class="card text-center">
                <img class="card-img-top" src="${drink.image}" alt="${drink.name}">
                <div class="card-body">
                    <h5 class="card-title">${drink.name}</h5>
                </div>
            </div>
        </div>
    `).join('');
    
    // Aggiungi gli eventi di click alle card
    document.querySelectorAll(".drink-item").forEach(item => {
        item.addEventListener("click", () => {
            const drinkName = item.getAttribute("data-name");
            // Controlla se è un drink locale o dell'API
            const localDrinks = {
                'negroni': 'negroni.html',
                'margarita': 'margarita.html',
                'long island': 'longisland.html',
                'sex on the beach': 'sexonthebeach.html'
            };
            
            if (localDrinks[drinkName]) {
                window.location.href = localDrinks[drinkName];
            } else {
                // Per i drink dell'API, cerca l'ID del drink
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkName)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.drinks && data.drinks.length > 0) {
                            window.location.href = `drink.html?id=${data.drinks[0].idDrink}`;
                        }
                    });
            }
        });
    });
}

// Funzione per salvare un drink locale visualizzato
function saveLocalDrinkViewed(drinkName, imagePath) {
    saveViewedDrink(drinkName, imagePath);
}

// Inizializza la visualizzazione dei drink recenti quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', displayRecentDrinks); 