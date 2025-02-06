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

    function renderProducts(products) {
        const productList = document.querySelector('.container.my-4 .row');
        productList.innerHTML = ""; // Pulisce i risultati precedenti

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("col-6", "col-md-3", "col-lg-2", "drink-item");
            productDiv.setAttribute("data-name", product.strDrink.toLowerCase()); // Aggiunge il nome in minuscolo per la ricerca

            productDiv.innerHTML = `
                <div class="card text-center drink-card" style="background-color: #d5ab30; cursor: pointer;" data-id="${product.idDrink}">
                    <img class="card-img-top" src="${product.strDrinkThumb}" alt="${product.strDrink}">
                    <div class="card-body">
                        <h5 class="card-title">${product.strDrink}</h5>
                    </div>
                </div>
            `;

            productList.appendChild(productDiv);
        });

        // Aggiungo gli eventi di click DOPO che le card sono state create
        document.querySelectorAll(".drink-card").forEach(card => {
            card.addEventListener("click", (event) => {
                const drinkId = event.currentTarget.getAttribute("data-id");
                if (drinkId) {
                    window.location.href = `drink.html?id=${drinkId}`;
                }
            });
        });

        // Nasconde il pulsante dopo il clic
        document.getElementById("showMoreButton").style.display = "none";
    }

    fetchProducts();
});

// 🎯 Funzione per filtrare i drink dalla barra di ricerca
function filterDrinks() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const drinkItems = document.querySelectorAll(".drink-item");

    drinkItems.forEach(item => {
        const drinkName = item.getAttribute("data-name");
        if (drinkName.includes(searchInput)) {
            item.style.display = "block"; // Mostra i drink che corrispondono alla ricerca
        } else {
            item.style.display = "none"; // Nasconde gli altri
        }
    });
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
