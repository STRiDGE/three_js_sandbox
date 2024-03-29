const THREE = require('three');

export class Brick extends THREE.Mesh{

	constructor(width = 3, height = 1, depth = 2, material = Brick.getMaterial()) {
		super(Brick.makeGeometry(width, height, depth), material);
	}

	onMouseOver() {
		// this.material.color.setHex(0xff0000);
		// console.log("over");
		this.isOver = true;
		if (!this.hoverTimer) {
			const t = this;
			this.hoverTimer = setInterval(function () { t.animateHover(); }, 16);
		}
	}

	onMouseOut() {
		// this.material.color.setHex(0xffff00);
		// console.log("out");
		this.isOver = false;
		if (!this.hoverTimer) {
			const t = this;
			this.hoverTimer = setInterval(function () { t.animateHover(); }, 16);
		}
	}

	animateHover() {
		if (!this.material) {
			clearInterval(this.hoverTimer);
			this.hoverTimer = null;
			console.log("No material");
			return;
		}

		if (this.isOver) {
			this.material.color.g -= 0.05;
			if (this.material.color.g <= 0) {
				this.material.color.g = 0;
				clearInterval(this.hoverTimer);
				this.hoverTimer = null;
			}
		} else {
			this.material.color.g += 0.01;

			if (this.material.color.g >= 1) {
				this.material.color.g = 1;
				clearInterval(this.hoverTimer);
				this.hoverTimer = null;
			}
		}
	}

	static getCubeMap() {
		return new THREE.CubeTextureLoader()
			.setPath( 'textures/cube/pisa/' )
			.load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );
	}

	static getMaterial() {
		return new THREE.MeshLambertMaterial({
			color: 0xffff00
			, envMap: this.getCubeMap()
			, reflectivity: 0.5
		})
	}

	static makeGeometry(width, height, depth) {
		// borrowed from https://discourse.threejs.org/t/round-edged-box/1402

		const radius0 = 0.1;
		const smoothness = 2;

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
