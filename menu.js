document.getElementById("showMoreButton").addEventListener("click", () => {
    const cocktailApiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail";

    async function fetchProducts() {
        try {
            const response = await fetch(cocktailApiUrl);
            const data = await response.json();
            const products = data.drinks;
            renderProducts(products);
        } catch (error) {
            console.error("Errore nel caricamento dei prodotti", error);
        }
    }

    async function fetchDrinkDetails(drinkId) {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
            const data = await response.json();
            return data.drinks[0];
        } catch (error) {
            console.error("Errore nel caricamento dei dettagli del drink", error);
            return null;
        }
    }

    function getIngredientsList(drink) {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${measure || ''} ${ingredient}`);
            }
        }
        return ingredients;
    }

    function createDrinkCard(drink, ingredients) {
        return `
            <div class="col-6 col-md-2 col-lg-2 drink-item" data-name="${drink.strDrink.toLowerCase()}" data-drink-id="${drink.idDrink}">
                <a href="drink.html?id=${encodeURIComponent(drink.idDrink)}" class="card text-center" style="text-decoration: none; color: inherit;">
                    <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                    <div class="card-body">
                        <h5 class="card-title">${drink.strDrink}</h5>
                        <div class="favorite-icon">
                            <i class="far fa-heart"></i>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    async function renderProducts(products) {
        const productList = document.querySelector('.container.my-4 .row');
        const existingDrinks = Array.from(productList.children);
        productList.innerHTML = "";
        
        // Ripristina i drink pre-esistenti
        existingDrinks.forEach(drink => {
            productList.appendChild(drink);
        });

        // Ottieni i preferiti dell'utente
        const favorites = getFavorites();

        products.forEach(product => {
            const drinkHtml = createDrinkCard(product);
            productList.insertAdjacentHTML('beforeend', drinkHtml);
        });

        // Aggiungi gli eventi per i preferiti alle nuove card
        const favoriteIcons = document.querySelectorAll('.favorite-icon');
        favoriteIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Previene il click sulla card
                if (!isUserLoggedIn()) {
                    showNotification('Devi effettuare il login per salvare i drink preferiti');
                    return;
                }
                const card = icon.closest('.card');
                const drinkName = card.querySelector('.card-title').textContent;
                const imgSrc = card.querySelector('.card-img-top').src;
                const isNowFavorite = toggleFavorite(drinkName, imgSrc);
                updateFavoriteIcon(icon, isNowFavorite);
            });

            // Verifica se il drink è già nei preferiti
            const card = icon.closest('.card');
            const drinkName = card.querySelector('.card-title').textContent;
            const isFavorite = favorites.some(drink => drink.name === drinkName);
            if (isFavorite) {
                updateFavoriteIcon(icon, true);
            }
        });

        // Non è più necessario aggiungere eventi di click per la navigazione
        // perché ora le card sono avvolte in un tag <a> che gestisce la navigazione

        // Nasconde il pulsante dopo il clic
        document.getElementById("showMoreButton").style.display = "none";
    }

    fetchProducts();
});

// 🎯 Funzione per filtrare i drink dalla barra di ricerca
function filterDrinks() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const drinkItems = document.querySelectorAll(".drink-item");

    if (searchInput === "") {
        // Mostra tutti i drink quando la ricerca è vuota
        drinkItems.forEach(item => {
            item.style.display = "block";
        });
    } else {
        drinkItems.forEach(item => {
            const drinkName = item.getAttribute("data-name");
            if (drinkName && drinkName.includes(searchInput)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }
}

// Evento sul pulsante di ricerca
document.getElementById("searchButton").addEventListener("click", filterDrinks);

// Evento per premere "Enter" e attivare la ricerca
document.getElementById("searchInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita il refresh della pagina
        filterDrinks();
    }
});

// Quando aggiungi le nuove card al container
function displayDrinks(drinks) {
    const container = document.getElementById('drinksContainer');
    drinks.forEach(drink => {
        container.innerHTML += createDrinkCard(drink);
    });
    
    // Reinizializza i preferiti per le nuove card
    initializeFavorites();
}

// Funzione per mostrare la notifica
function showNotification(message) {
    // Rimuovi eventuali notifiche esistenti
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Rimuovi la notifica dopo 3 secondi
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funzione per cercare drink
function searchDrinks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const drinks = document.querySelectorAll('.drink-item');
    let found = false;

    drinks.forEach(drink => {
        const drinkName = drink.getAttribute('data-name').toLowerCase();
        if (drinkName.includes(searchInput)) {
            drink.style.display = 'block'; // Mostra il drink
            found = true;
        } else {
            drink.style.display = 'none'; // Nascondi il drink
        }
    });

    // Mostra la notifica se non ci sono risultati
    const notification = document.getElementById('noDrinkNotification');
    if (!found) {
        notification.style.display = 'flex'; // Mostra la notifica
        setTimeout(() => {
            notification.style.display = 'none'; // Nascondi dopo 3 secondi
        }, 3000);
    } else {
        notification.style.display = 'none'; // Nascondi la notifica se ci sono risultati
    }
}

// Aggiungi l'evento al bottone di ricerca
document.getElementById('searchButton').addEventListener('click', searchDrinks);
