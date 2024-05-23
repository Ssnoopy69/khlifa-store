import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", function () {
  // Split view functionality
  var parent = document.querySelector(".splitview"),
    topPanel = parent.querySelector(".top"),
    handle = parent.querySelector(".handle"),
    skewHack = 0,
    delta = 0;

  if (parent.className.indexOf("skewed") != -1) {
    skewHack = 1000;
  }

  parent.addEventListener("mousemove", function (event) {
    delta = (event.clientX - window.innerWidth / 2) * 0.5;
    handle.style.left = event.clientX + delta + "px";
    topPanel.style.width = event.clientX + skewHack + delta + "px";
  });

  // Three.js container setup
  const container = document.getElementById("threejs-container");
  const productSlider = document.getElementById("product-slider");

  // Scene setup for the main model display
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const loader = new GLTFLoader();

  // Display random products in a slider
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
          <button>View Product</button>
      </div>
    `;
    productSlider.appendChild(productDiv);

    loader.load(
      `components/models/${product.model}`,
      function (gltf) {
        const productContainer = document.getElementById(`model-${product.id}`);
        const productScene = new THREE.Scene();

        const productLight = new THREE.DirectionalLight(0xffffff, 1);
        productLight.position.set(1, 1, 1).normalize();
        productScene.add(productLight);

        const model = gltf.scene;
        model.position.set(0, -1, 0);
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
          alpha: true,
        });
        productRenderer.setSize(
          productContainer.clientWidth,
          productContainer.clientHeight
        );
        productContainer.appendChild(productRenderer.domElement);

        function animateProduct() {
          requestAnimationFrame(animateProduct);
          productRenderer.render(productScene, productCamera);
        }
        animateProduct();

        // Mouse-based horizontal rotation (y-axis only)
        let isDragging = false;
        let previousMousePosition = {
          x: 0,
          y: 0,
        };

        productContainer.addEventListener("mousedown", function (event) {
          isDragging = true;
        });

        productContainer.addEventListener("mousemove", function (event) {
          const deltaMove = {
            x: event.offsetX - previousMousePosition.x,
            y: event.offsetY - previousMousePosition.y,
          };

          if (isDragging) {
            const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(0, toRadians(deltaMove.x * 1), 0, "XYZ")
            );

            model.quaternion.multiplyQuaternions(
              deltaRotationQuaternion,
              model.quaternion
            );
          }

          previousMousePosition = {
            x: event.offsetX,
            y: event.offsetY,
          };
        });

        productContainer.addEventListener("mouseup", function (event) {
          isDragging = false;
        });

        productContainer.addEventListener("mouseleave", function (event) {
          isDragging = false;
        });

        function toRadians(angle) {
          return angle * (Math.PI / 180);
        }

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

  // Description animation on scroll
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

  // Star rating functionality
  const stars = document.querySelectorAll(".stars i");
  const ratingInput = document.getElementById("rating");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = star.getAttribute("data-rating");
      ratingInput.value = rating;

      stars.forEach((s) => {
        if (s.getAttribute("data-rating") <= rating) {
          s.classList.add("selected");
        } else {
          s.classList.remove("selected");
        }
      });
    });
  });

  // Form submission (placeholder - replace with actual submission code)
  document
    .getElementById("review-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Review submitted! (This is a placeholder alert)");
    });
});
