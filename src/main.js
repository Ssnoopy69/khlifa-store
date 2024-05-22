import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", function () {
  var parent = document.querySelector(".splitview"),
    topPanel = parent.querySelector(".top"),
    handle = parent.querySelector(".handle"),
    skewHack = 0,
    delta = 0;

  // If the parent has .skewed class, set the skewHack var.
  if (parent.className.indexOf("skewed") != -1) {
    skewHack = 1000;
  }

  parent.addEventListener("mousemove", function (event) {
    // Get the delta between the mouse position and center point.
    delta = (event.clientX - window.innerWidth / 2) * 0.5;

    // Move the handle.
    handle.style.left = event.clientX + delta + "px";

    // Adjust the top panel width.
    topPanel.style.width = event.clientX + skewHack + delta + "px";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("threejs-container");
  const productSlider = document.getElementById("product-slider");

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Basic Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Load and display a random T-shirt model
  const loader = new GLTFLoader();

  // Display random 5 products in a slider
  const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 5);
  randomProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-card");
    productDiv.innerHTML = `
      <div id="model-${
        product.id
      }" class="model-container" style="width: 200px; height: 200px;"></div>
      <div class="product-details">
          <h2>${product.name}</h2>
          <p>Price: $${product.price.toFixed(2)}</p>
          <button>Add to Cart</button>
      </div>
    `;
    productSlider.appendChild(productDiv);

    // Load 3D model for each product
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
        model.position.set(0, -1, 0); // Adjust model position if needed
        model.scale.set(0.15, 0.15, 0.15);
        productScene.add(model);

        const productCamera = new THREE.PerspectiveCamera(
          75,
          productContainer.clientWidth / productContainer.clientHeight,
          0.1,
          1000
        );
        productCamera.position.z = 3;

        const productRenderer = new THREE.WebGLRenderer({
          antialias: true,
        });
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
document.addEventListener("DOMContentLoaded", function () {
  const descriptions = document.querySelectorAll(".description");

  function checkScroll() {
    const triggerBottom = (window.innerHeight / 5) * 4;

    descriptions.forEach((description) => {
      const descriptionTop = description.getBoundingClientRect().top;

      if (descriptionTop < triggerBottom) {
        description.classList.add("show");
      } else {
        description.classList.remove("show");
      }
    });
  }

  window.addEventListener("scroll", checkScroll);
  checkScroll();
});
