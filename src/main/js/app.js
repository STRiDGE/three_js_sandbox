const THREE = require('three');

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let scene, aspect, camera, renderer, controls;

let mouse = { x: 0, y: 0 }, INTERSECTED;
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

	if (intersects.length > 0) {
		//console.log('intersect', intersects[0].object.material.color.getHex());
		if (intersects[0].object !== INTERSECTED) {
			if (INTERSECTED) {
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			}

			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			INTERSECTED.material.color.setHex(0xff0000);
		}
	} else {
		if (INTERSECTED) {
			INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			INTERSECTED = null;
		}
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



