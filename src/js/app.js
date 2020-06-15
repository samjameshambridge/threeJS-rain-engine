import * as THREE from "three";

export default class Application {
  constructor({ numberOfClouds, rainCount }) {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    this.positionCamera();

    this.animate_binded = this.animate.bind(this);
    this.cloudParticles = [];
    this.lightningFlash = null;
    this.loader = null;
    this.numberOfClouds = numberOfClouds;
    this.rainCount = rainCount;
    this.rainGeometry = null;
    this.renderer = null;
  }

  positionCamera() {
    this.camera.position.z = 1;
    this.camera.rotation.x = 1.16;
    this.camera.rotation.y = -0.12;
    this.camera.rotation.z = 0.27;
  }

  init() {
    this.initAmbientLight();

    this.initDirectionalLight();

    this.initLightningFlash();

    this.initRain();

    this.setRenderer();

    this.initLoader();

    this.loadClouds();
  }

  initAmbientLight() {
    var ambientLight = new THREE.AmbientLight(0x555555);

    this.scene.add(ambientLight);
  }

  initDirectionalLight() {
    var directionalLight = new THREE.DirectionalLight(0xffeedd);

    directionalLight.position.set(0, 0, 1);

    this.scene.add(directionalLight);
  }

  initLightningFlash() {
    this.lightningFlash = new THREE.PointLight(0x062d89, 30, 500, 1.7);

    this.lightningFlash.position.set(200, 300, 100);

    this.scene.add(this.lightningFlash);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  initLoader() {
    this.loader = new THREE.TextureLoader();
  }

  initRain() {
    this.rainGeometry = new THREE.Geometry();

    var rainDrop;

    for (var i = 0; i < this.rainCount; i++) {
      rainDrop = new THREE.Vector3(
        Math.random() * 400 - 200,
        Math.random() * 500 - 250,
        Math.random() * 400 - 200
      );

      rainDrop.velocity = {};
      rainDrop.velocity = 0;

      this.rainGeometry.vertices.push(rainDrop);
    }

    var rainMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.1,
      transparent: true,
    });

    var rain = new THREE.Points(this.rainGeometry, rainMaterial);

    this.scene.add(rain);
  }

  loadClouds() {
    this.loader.load("./img/smoke.png", this.onCloudLoad.bind(this));
  }

  onCloudLoad(texture) {
    var cloudGeometry = new THREE.PlaneBufferGeometry(500, 500);
    var cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });
    var cloud;

    for (let i = 0; i < this.numberOfClouds; i++) {
      cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

      this.setCloudPosition(cloud);

      this.setCloudRotation(cloud);

      cloud.material.opacity = 0.6;

      this.scene.add(cloud);

      this.cloudParticles.push(cloud);
    }

    this.animate_binded();
  }

  setCloudPosition(cloud) {
    var xRandom = Math.random() * 800 - 400;
    var zRandom = Math.random() * 500 - 450;
    var y = 500;

    cloud.position.set(xRandom, y, zRandom);
  }

  setCloudRotation(cloud) {
    cloud.rotation.x = 1.16;
    cloud.rotation.y = -0.12;
    cloud.rotation.z = Math.random() * 360;
  }

  animateLightningFlash() {
    if (Math.random() > 0.97 || this.lightningFlash.power > 100) {
      if (this.lightningFlash.power < 100) {
        this.lightningFlash.position.set(
          Math.random() * 400,
          300 + Math.random() * 200,
          100
        );
      }

      this.lightningFlash.power = 50 + Math.random() * 500;
    }
  }

  animateRaindrops() {
    var vertice;

    for (var i = 0; i < this.rainGeometry.vertices.length; i++) {
      vertice = this.rainGeometry.vertices[i];

      vertice.velocity -= 0.01 + Math.random() * 0.1;
      vertice.y += vertice.velocity;

      if (vertice.y < -200) {
        vertice.y = 200;
        vertice.velocity = 0;
      }
    }

    this.rainGeometry.verticesNeedUpdate = true;
  }

  animate() {
    var cloudParticle;

    for (var i = 0; i < this.cloudParticles.length; i++) {
      cloudParticle = this.cloudParticles[i];

      cloudParticle.rotation.z -= 0.002;
    }

    this.animateLightningFlash();

    this.animateRaindrops();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate_binded);
  }
}
