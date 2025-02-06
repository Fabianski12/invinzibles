document.addEventListener("DOMContentLoaded", () => {
    const randomAPIUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    const roulette = document.querySelector(".img1"); // Ruota
    const loadingText = document.getElementById("loadingText"); // Testo "Caricamento in corso..."
    const fortunatoTitle = document.getElementById("fortunatoTitle"); // Titolo "Mi Sento Fortunato"
    const appContainer = document.getElementById("app"); // Contenitore della ruota

    // Dopo 3 secondi nasconde la ruota e il testo di caricamento, poi carica i drink
    setTimeout(async () => {
        if (roulette) roulette.style.display = "none"; // Nasconde la ruota
        if (appContainer) appContainer.style.height = "0px"; // Riduce l'altezza della ruota
        if (loadingText) loadingText.style.display = "none"; // Nasconde il testo di caricamento
        if (fortunatoTitle) {
            fortunatoTitle.style.display = "block"; // Mostra il titolo
            fortunatoTitle.style.marginTop = "30px"; // Lo sposta leggermente in alto
        }

        await fetchProducts1(); // Avvia la chiamata all'API
    }, 3000);

    async function fetchProducts1() {
        try {
            const response = await fetch(randomAPIUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Dati API ricevuti:", data);

            if (!data || !data.drinks || data.drinks.length === 0) {
                console.error("Errore: nessun drink ricevuto dall'API");
                return;
            }

            renderProducts1(data.drinks);
        } catch (error) {
            console.error("Errore nel caricamento dei drink:", error);
        }
    }

    function renderProducts1(products) {
        const container = document.getElementById("fortunatoContainer");
        console.log("Container trovato:", container);

        if (!container) {
            console.error("Errore: container non trovato!");
            return;
        }

        container.innerHTML = ""; // Pulisce il contenuto precedente
        container.style.marginTop = "30px"; // Sposta i drink leggermente in alto

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("col-6", "col-md-2", "col-lg-2");

            productCard.innerHTML = `
                <div class="card text-center drink-card" style="background-color: #d5ab30;" data-id="${product.idDrink}">
                    <img class="card-img-top" src="${product.strDrinkThumb}" alt="${product.strDrink}">
                    <div class="card-body">
                        <h5 class="card-title">${product.strDrink}</h5>
                    </div>
                </div>
            `;

            container.appendChild(productCard);
        });

        console.log("Drink aggiunti con successo!");

        // Aggiungo gli eventi di click alle card
        document.querySelectorAll(".drink-card").forEach(card => {
            card.addEventListener("click", (event) => {
                const drinkId = event.currentTarget.getAttribute("data-id");
                if (drinkId) {
                    window.location.href = `drink.html?id=${drinkId}`;
                }
            });
        });
    }
});
