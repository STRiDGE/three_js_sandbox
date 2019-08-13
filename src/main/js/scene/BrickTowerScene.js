import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Brick} from "../geometry/Brick";

export class BrickTowerScene {

	constructor() {
		this.init();

		this.animate();
	}

	dispose() {
		cancelAnimationFrame(this.id);
		this.renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
		this.scene = null;
		this.camera = null;
		this.controls = null;
		this.empty(this.renderer.domElement);
		document.body.removeChild(this.renderer.domElement);
	}

	empty(elem) {
		while (elem.lastChild) elem.removeChild(elem.lastChild);
	}

	init() {
		const width = window.innerWidth - 16;
		const height = window.innerHeight - 20;

		this.scene = new THREE.Scene();
		let aspect = width / height;
		this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
		this.camera.position.z = 10;

		this.renderer = new THREE.WebGLRenderer();

		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.controls = new OrbitControls(this.camera);

		const light = new THREE.DirectionalLight(0xdddddd, 0.8);
		light.position.set(-80, 80, 80);
		this.scene.add(light);

		const ambientLight = new THREE.AmbientLight(0x444444);
		this.scene.add(ambientLight);

		document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);

		this.mouse = {x: 0, y: 0};
		this.intersected = null;

		this.setScene();

		this.scene.background = Brick.getCubeMap();

		console.log('BrickWallScene loaded')
	}

	animate() {
		this.id = requestAnimationFrame(this.animate.bind(this));
		this.render();
		this.update();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update() {

		const raycaster = new THREE.Raycaster();

		raycaster.setFromCamera(this.mouse, this.camera);

		let intersects = raycaster.intersectObjects(this.scene.children, true);

		let over;
		if (intersects.length > 0) {
			over = intersects[0].object;

			if (over === this.intersected) {
				// same object, do nothing
			} else {
				if (typeof over.onMouseOver === "function") {
					over.onMouseOver();
				}

				if (this.intersected) {
					if (typeof this.intersected.onMouseOut === "function") {
						this.intersected.onMouseOut();
					}
				}

				this.intersected = over;
			}
		} else {
			if (this.intersected) {
				if (typeof this.intersected.onMouseOut === "function") {
					this.intersected.onMouseOut();
				}

				this.intersected = null;
			}
		}

		this.controls.update();
	}


	onDocumentMouseMove(event) {
		// normalized device coordinates
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// console.log(mouse);
	}

	setScene() {
		let brickWall = BrickTowerScene.createBrickTower();
		this.scene.add(brickWall);
	}

	static createBrickTower() {
		const brickWall = new THREE.Group();
		const numLayers = 4;
		const layerSize = 10;
		const radius = 5;

		for (let layer = 0; layer < numLayers; layer++) {
			let y = layer - (numLayers / 2);

			for (let i = 0; i < layerSize; i++) {
				let rot = (i / layerSize) * (Math.PI * 2);

				if (layer % 2 === 0) {
					rot += (0.5 / layerSize) * (Math.PI * 2);
				}

				const x = Math.cos(rot) * radius;
				const z = Math.sin(rot) * radius;

				// let x = (layerSize * 3) / 2 - (i * 3);
				// if (layer % 2 === 0) {
				// 	x = x + 1.5;
				// }

				brickWall.add(BrickTowerScene.createBrick(x, y, z, rot + Math.PI/2));
			}
		}

		return brickWall;
	}

	static createBrick(x, y, z, rotation, material = Brick.defaultMaterial()) {
		const brick = new Brick(material);

		brick.position.set(x, y, z);
		brick.rotateY(-rotation);
		return brick;
	}

}
