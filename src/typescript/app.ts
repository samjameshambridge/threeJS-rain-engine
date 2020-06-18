import * as THREE from "three";
import { RainDrops } from "./interfaces";

export default class Application {
  animate_binded: FrameRequestCallback;
  camera: THREE.PerspectiveCamera;
  cloudParticles: THREE.Mesh[];
  lightningFlash: THREE.PointLight;
  loader: THREE.TextureLoader;
  numberOfClouds: number;
  rainCount: number;
  rain: THREE.Points;
  rainDrops: RainDrops[];
  rainGeometry: THREE.Geometry;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;

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
    this.numberOfClouds = numberOfClouds;
    this.rainCount = rainCount;
    this.rainDrops = [];
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

    this.initFog();

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

  initFog() {
    this.scene.fog = new THREE.FogExp2(0x1c1c2a, 0.001);

    this.renderer.setClearColor(this.scene.fog.color);
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

    for (var i = 0; i < this.rainCount; i++) {
      let rainDrop = {
        vertice: new THREE.Vector3(
          Math.random() * 400 - 200,
          Math.random() * 500 - 250,
          Math.random() * 400 - 200
        ),
        velocity: 0,
      };

      this.rainGeometry.vertices.push(rainDrop.vertice);

      this.rainDrops.push(rainDrop);
    }

    var rainMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.1,
      transparent: true,
    });

    this.rain = new THREE.Points(this.rainGeometry, rainMaterial);

    this.scene.add(this.rain);
  }

  loadClouds() {
    this.loader.load("./img/smoke.png", this.onCloudLoad.bind(this));
  }

  onCloudLoad(texture: THREE.Texture) {
    var cloudGeometry = new THREE.PlaneBufferGeometry(500, 500);
    var cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });

    for (let i = 0; i < this.numberOfClouds; i++) {
      let cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

      this.setCloudPosition(cloud);

      this.setCloudRotation(cloud);

      cloud.material.opacity = 0.6;

      this.scene.add(cloud);

      this.cloudParticles.push(cloud);
    }

    this.animate();
  }

  setCloudPosition(cloud: THREE.Mesh) {
    var xRandom = Math.random() * 800 - 400;
    var zRandom = Math.random() * 500 - 450;
    var y = 500;

    cloud.position.set(xRandom, y, zRandom);
  }

  setCloudRotation(cloud: THREE.Mesh) {
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
    for (var i = 0; i < this.rainDrops.length; i++) {
      let raindrop = this.rainDrops[i];

      raindrop.velocity -= 0.01 + Math.random() * 0.1;
      raindrop.vertice.y += raindrop.velocity;

      if (raindrop.vertice.y < -200) {
        raindrop.vertice.y = 200;
        raindrop.velocity = 0;
      }
    }

    this.rainGeometry.verticesNeedUpdate = true;

    this.rain.rotation.y += 0.002;
  }

  animate() {
    for (var i = 0; i < this.cloudParticles.length; i++) {
      let cloudParticle = this.cloudParticles[i];

      cloudParticle.rotation.z -= 0.002;
    }

    this.animateLightningFlash();

    this.animateRaindrops();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate_binded);
  }
}
