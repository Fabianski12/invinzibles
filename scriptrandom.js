document.addEventListener("DOMContentLoaded", () => {
    const randomAPIUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    // Funzione per caricare i prodotti
    async function fetchProducts() {
        try {
            const response = await fetch(randomAPIUrl);
            const data = await response.json();
            const products = data.drinks;
            renderProducts(products);
        } catch (error) {
            console.error("Errore nel caricamento dei prodotti", error);
        }
    }

    // Funzione per renderizzare i prodotti
    function renderProducts(products) {
        const productList = document.getElementById("productList");
        productList.innerHTML = ""; // Pulisce la lista esistente

        products.forEach(product => {
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
        await fetchProducts();
    });
});
