
const THREE = require('three');

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Brick} from "./geometry/Brick";


let scene, aspect, camera, renderer, controls;

let mouse = {x: 0, y: 0};
// let INTERSECTED;

let animated = [];


init();
animate();

function init() {
	const width = window.innerWidth - 16;
	const height = window.innerHeight - 20;

	scene = new THREE.Scene();
	aspect = width / height;
	camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
	camera.position.z = 10;

	renderer = new THREE.WebGLRenderer();

	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera);

	const light = new THREE.DirectionalLight(0xdddddd, 0.8);
	light.position.set(-80, 80, 80);
	scene.add(light);

	const ambientLight = new THREE.AmbientLight( 0x444444 );
	scene.add(ambientLight);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	setScene();
}

function animate() {
	requestAnimationFrame(animate);
	render();
	update();
}

function createBrick(x, y) {
	const brick = new Brick();

	brick.position.set(x, y, 0);
	return brick;
}

function createBrickWall() {
	const brickWall = new THREE.Group();
	const numLayers = 4;
	const layerSize = 10;

	for (let layer = 0; layer < numLayers; layer++) {
		let y = layer - (numLayers / 2);

		for (let i = 0; i < layerSize; i++) {
			let x = (layerSize * 3) / 2 - (i * 3);
			if (layer % 2 === 0) {
				x = x + 1.5;
			}

			brickWall.add(createBrick(x, y));
		}
	}

	return brickWall;
}

function setScene() {
	scene.add(createBrickWall());
}


function render() {
	renderer.render(scene, camera);
}

function update() {

	const raycaster = new THREE.Raycaster();

	raycaster.setFromCamera( mouse, camera );

	let intersects = raycaster.intersectObjects( scene.children, true );

	let over;
	if (intersects.length > 0) {
		over = intersects[0].object;

		if (!animated.includes(over)) {
			// if interested not in animated yet, add it
			over.isOver = true;
			animated.push(over);
		} else {
			// if it is being animated but not over, set over again
			animated[animated.indexOf(over)].isOver = true;
		}
	}

	// if any item was over but not intersected anymore, disable over flag
	animated.forEach( function (item) {
		if (item.isOver) {
			if (item !== over) {
				// console.log('flip');
				item.isOver = false;
			}
		}
	});

	let i = animated.length - 1;

	while (i >= 0) {
		let item = animated[i];

		if (item instanceof Brick) {
			if (item.updateAnimation()) {
				animated.splice(i, 1);
			}
		}

		i -= 1;

	}

	controls.update();
}


function onDocumentMouseMove( event ) {
	// normalized device coordinates
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// console.log(mouse);
}



