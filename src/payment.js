import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("model-display");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const product = products.find((p) => p.id === productId);

  if (!product) {
    alert("Product not found!");
    return;
  }

  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDescriptionText = document.getElementById(
    "product-description-text"
  );

  productName.textContent = product.name;
  productPrice.textContent = `Price: $${product.price.toFixed(2)}`;
  productDescriptionText.textContent = product.description;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 8;
  camera.position.y = 2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load(
    `components/models/${product.model}`,
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, -2.5, 0);
      model.scale.set(0.5, 0.5, 0.5);
      scene.add(model);

      let isDragging = false,
        previousMousePosition = {
          x: 0,
          y: 0,
        };

      function onDocumentMouseDown(event) {
        event.preventDefault();

        isDragging = true;

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }

      function onDocumentMouseMove(event) {
        event.preventDefault();

        if (isDragging) {
          const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
          };

          model.rotation.y += deltaMove.x * 0.01;

          previousMousePosition = {
            x: event.clientX,
            y: event.clientY,
          };
        }
      }

      function onDocumentMouseUp(event) {
        event.preventDefault();

        isDragging = false;
      }

      document.addEventListener("mousedown", onDocumentMouseDown, false);
      document.addEventListener("mousemove", onDocumentMouseMove, false);
      document.addEventListener("mouseup", onDocumentMouseUp, false);

      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    function (error) {
      console.error("Error loading model", error);
    }
  );

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Color-changing buttons
  const redButton = document.getElementById("red-button");
  const blueButton = document.getElementById("blue-button");
  const greenButton = document.getElementById("green-button");

  function changeModelColor(color) {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(color);
      }
    });
  }

  redButton.addEventListener("click", () => {
    changeModelColor(0xff0000); // Red color
  });

  blueButton.addEventListener("click", () => {
    changeModelColor(0x0000ff); // Blue color
  });

  greenButton.addEventListener("click", () => {
    changeModelColor(0x00ff00); // Green color
  });
});
