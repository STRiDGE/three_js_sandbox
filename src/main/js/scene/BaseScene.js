import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Brick} from "../geometry/Brick";

export class BaseScene {

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
		BaseScene.empty(this.renderer.domElement);
		document.body.removeChild(this.renderer.domElement);
	}

	static empty(elem) {
		while (elem.lastChild) elem.removeChild(elem.lastChild);
	}

	init() {
		const width = window.innerWidth - 16;
		const height = window.innerHeight - 50;

		this.scene = new THREE.Scene();
		let aspect = width / height;
		this.camera = BaseScene.createCamera(aspect);

		this.renderer = new THREE.WebGLRenderer();

		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.controls = new OrbitControls(this.camera);

		this.addDirectionalLight();
		this.addAmbientLight();

		document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);

		this.mouse = {x: 1000, y: 1000};
		this.intersected = null;

		this.setScene();

		this.scene.background = Brick.getCubeMap();

		console.log('BrickWallScene loaded')
	}

	addAmbientLight() {
		this.scene.add(new THREE.AmbientLight(0x444444));
	}

	addDirectionalLight() {
		const light = new THREE.DirectionalLight(0xffffff, 0.8);
		light.position.set(-1, 1, 1);
		light.castShadow = true;

		this.scene.add(light);
	}

	static createCamera(aspect) {
		const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
		camera.position.z = 20;
		return camera;
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
		throw new Error('You have to implement setScene!');
	}

}
