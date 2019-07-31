const THREE = require('three');

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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

function createBrick(x, y, color = 0xffff00) {
	let material = new THREE.MeshStandardMaterial({color: color});

	//let geometry = new THREE.BoxGeometry(3, 1, 2);
	// borrowed from https://discourse.threejs.org/t/round-edged-box/1402


	const radius0 = 0.1;
	const smoothness = 2;
	const width = 3;
	const height = 1;
	const depth = 2;

	let shape = new THREE.Shape();
	let eps = 0.00001;
	let radius = radius0 - eps;
	shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
	shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
	shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
	shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
	let geometry = new THREE.ExtrudeBufferGeometry( shape, {
		depth: depth - radius0 * 2,
		bevelEnabled: true,
		bevelSegments: smoothness * 2,
		steps: 1,
		bevelSize: radius,
		bevelThickness: radius0,
		curveSegments: smoothness
	});

	geometry.center();

	const brick = new THREE.Mesh(
		geometry
		, material
	);

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
// var geometry = ;
// var material = new THREE.MeshNormalMaterial();
// 	const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
// const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), material);
// scene.add(cube);


	scene.add(createBrickWall());

	// for (let i = 0; i < 10; i++) {
	// 	const brick = createBrick(15 - (i * 3.1), -1);
	// 	brickWall.add(brick);
	//
	// 	const brick2 = new THREE.Mesh(
	// 		new THREE.BoxGeometry(3, 1, 2)
	// 		, new THREE.MeshStandardMaterial({ color: 0xffff00 })
	// 	);
	// 	brick2.position.set(13.5 - (i * 3.1), -2.1, 0);
	// 	brickWall.add(brick2);
	// }

// const light = new THREE.PointLight(0xdddddd, 0.8);
// light.position.set(-80, 80, 80);

}



// let i = 0;
// let grow = true;

function render() {
	renderer.render(scene, camera);
}

function update() {

	const raycaster = new THREE.Raycaster();

	raycaster.setFromCamera( mouse, camera );

	let intersects = raycaster.intersectObjects( scene.children, true );

	// if (intersects.length > 0) {
	// 	//console.log('intersect', intersects[0].object.material.color.getHex());
	// 	if (intersects[0].object !== INTERSECTED) {
	// 		if (INTERSECTED) {
	// 			INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
	// 		}
	//
	// 		INTERSECTED = intersects[ 0 ].object;
	// 		INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
	// 		INTERSECTED.material.color.setHex(0xff0000);
	// 	}
	// } else {
	// 	if (INTERSECTED) {
	// 		INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
	// 		INTERSECTED = null;
	// 	}
	// }

	let over;
	if (intersects.length > 0) {
		// if interested not in animated yet, add it

		over = intersects[0].object;

		if (!animated.includes(over)) {
			// console.log('add');
			over.isOver = true;
			animated.push(over);
		} else {
			// if it is being animated but not over, set over again
			animated[animated.indexOf(over)].isOver = true;
		}
	}

	// console.log(over);

	// if any item was intersected but not anymore, flip it
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

		// console.log(item.material.color.g);
		if (item.isOver) {
			// if intersected, decrease green (until 0) but don't pop it

			if (item.material.color.g > 0) {
				item.material.color.g -= 0.05;
			}
		} else {
			// if not intersected, increase green (until 1) and pop it
			item.material.color.g += 0.01;

			if (item.material.color.g >= 1) {
				item.material.color.g = 1;
				animated.splice(i, 1);
				// console.log('pop', animated.length);
			}
		}

		i -= 1;

	}

	// console.log('INTERSECTED', INTERSECTED);

	controls.update();
}


function onDocumentMouseMove( event ) {
	// normalized device coordinates
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// console.log(mouse);
}



