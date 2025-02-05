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

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("col-6", "col-md-3", "col-lg-2");

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
    }

    fetchProducts();
});

  
  
  

document.addEventListener("DOMContentLoaded", () => {
    const randomAPIUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    // Funzione per caricare i prodotti
    async function fetchProductsrandom() {
        try {
            const response = await fetch(randomAPIUrl);
            const data = await response.json();
            const products = data.drinks;
            renderProductss(products);
        } catch (error) {
            console.error("Errore nel caricamento dei prodotti", error);
        }
    }

    // Funzione per renderizzare i prodotti
    function renderProductss(products) {
        const productList = document.getElementById("productLists");
        productList.innerHTML = ""; // Pulisce la lista esistente
        

        products.forEach(product => {
            productList.classList.add("product-grid"); // Aggiungi la classe per il layout a griglia
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
            productDiv.setAttribute("data-name", product.strDrink.toLowerCase());
            productDiv.innerHTML = `
                <img src="${product.strDrinkThumb}" alt="${product.strDrink}">
                <p>${product.strDrink.toUpperCase()}</p>
            `;
            productList.appendChild(productDiv);
        });
    }

    // Aggiungi evento al pulsante per chiamare l'API
    const randomButton = document.getElementById("randomButton");
    randomButton.addEventListener("click", async () => {
        await fetchProductsrandom();
    });
    fetchProducts();
});