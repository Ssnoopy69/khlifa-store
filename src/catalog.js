import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", function () {
  const catalogSection = document.querySelector("main section");

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>Price: $${product.price.toFixed(2)}</p>
            <div id="model-${product.id}" class="model-container"></div>
        `;
    catalogSection.appendChild(productDiv);

    // Load 3D model for each product
    const loader = new GLTFLoader();
    console.log(
      `Loading model for product: components/models/${product.model}`
    );
    loader.load(
      `components/models/${product.model}`,
      function (gltf) {
        const productContainer = document.getElementById(`model-${product.id}`);
        const productScene = new THREE.Scene();

        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        productScene.add(light);

        const model = gltf.scene;
        model.position.set(0, -2.5, 0); // Adjust model position if needed
        model.scale.set(0.3, 0.3, 0.3);
        productScene.add(model);

        const productCamera = new THREE.PerspectiveCamera(
          75,
          productContainer.clientWidth / productContainer.clientHeight,
          0.1,
          1000
        );
        productCamera.position.z = 5;

        const productRenderer = new THREE.WebGLRenderer({ antialias: true });
        productRenderer.setSize(
          productContainer.clientWidth,
          productContainer.clientHeight
        );
        productContainer.appendChild(productRenderer.domElement);

        function animateProduct() {
          requestAnimationFrame(animateProduct);
          model.rotation.y += 0.01;
          productRenderer.render(productScene, productCamera);
        }
        animateProduct();

        window.addEventListener("resize", () => {
          productCamera.aspect =
            productContainer.clientWidth / productContainer.clientHeight;
          productCamera.updateProjectionMatrix();
          productRenderer.setSize(
            productContainer.clientWidth,
            productContainer.clientHeight
          );
        });

        console.log(`Model for product ${product.id} loaded successfully`);
      },
      undefined,
      function (error) {
        console.error(`Error loading model for product ${product.id}`, error);
      }
    );
  });
});
