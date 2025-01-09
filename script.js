document.getElementById("searchBar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const products = document.querySelectorAll("#productList .product");
  let matches = []; // Prodotti corrispondenti
  let exactMatches = []; // Prodotti che iniziano con la query

  products.forEach(product => {
      const productName = product.getAttribute("data-name").toLowerCase();

      if (productName.startsWith(query) && query !== "") {
          exactMatches.push(product);
      } else if (productName.includes(query)) {
          matches.push(product);
      } else {
          product.style.display = "none"; // Nascondi prodotto
      }
  });

  // Mostra i risultati esatti prima degli altri
  [...exactMatches, ...matches].forEach(product => {
      product.style.display = "block";
  });

  // Gestione messaggio "Nessun alcolico trovato"
  const noResultsMessage = document.getElementById("noResults");
  if (exactMatches.length === 0 && matches.length === 0) {
      noResultsMessage.style.display = "block";
  } else {
      noResultsMessage.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const cocktailApiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail";

  // Funzione per caricare i prodotti
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

  // Carica i prodotti
  await fetchProducts();
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
        productList.classList.add("product-grid"); // Aggiungi la classe per il layout a griglia

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
        await fetchProductsrandom();
    });
    fetchProducts();
});

