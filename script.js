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
  