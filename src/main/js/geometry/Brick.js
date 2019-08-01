const THREE = require('three');

export class Brick extends THREE.Mesh{

	constructor(material = Brick.defaultMaterial()) {
		super(Brick.makeGeometry(), material);
	}

	static defaultMaterial() {
		return new THREE.MeshStandardMaterial({color: 0xffff00})
	}

	static makeGeometry() {
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

		return geometry;
	}

}
