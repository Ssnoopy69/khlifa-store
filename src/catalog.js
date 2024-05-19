import { products } from './products.js';

document.addEventListener('DOMContentLoaded', function () {
    const catalogSection = document.querySelector('main section');

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>Price: $${product.price.toFixed(2)}</p>
        `;
        catalogSection.appendChild(productDiv);
    });
});
