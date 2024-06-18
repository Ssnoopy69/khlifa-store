import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", function () {
  const catalogContainer = document.getElementById("catalog-container");

  const femaleProducts = products.filter((p) => p.gender === "female");

  femaleProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product";

    const productName = document.createElement("h2");
    productName.textContent = product.name;

    const productPrice = document.createElement("p");
    productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

    const productDescription = document.createElement("p");
    productDescription.textContent = product.description;

    productElement.appendChild(productName);
    productElement.appendChild(productPrice);
    productElement.appendChild(productDescription);

    catalogContainer.appendChild(productElement);
  });
});
