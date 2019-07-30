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

function setScene() {
// var geometry = ;
// var material = new THREE.MeshNormalMaterial();
// 	const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
// const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), material);
// scene.add(cube);

	const brickWall = new THREE.Group();
	scene.add(brickWall);

	for (let i = 0; i < 10; i++) {
		const brick = new THREE.Mesh(
			new THREE.BoxGeometry(3, 1, 2)
			, new THREE.MeshStandardMaterial({ color: 0xffff00 })
		);
		brick.position.set(15 - (i * 3.1), -1, 0);
		brickWall.add(brick);

		const brick2 = new THREE.Mesh(
			new THREE.BoxGeometry(3, 1, 2)
			, new THREE.MeshStandardMaterial({ color: 0xffff00 })
		);
		brick2.position.set(13.5 - (i * 3.1), -2.1, 0);
		brickWall.add(brick2);
	}

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



