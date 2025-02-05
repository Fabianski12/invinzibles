document.addEventListener("DOMContentLoaded", async () => {
    const randomAPIUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

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

    await fetchProducts1();
});
