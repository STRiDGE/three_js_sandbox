import * as THREE from 'three';
import {Brick} from "../geometry/Brick";
import {BaseScene} from "./BaseScene";

export class BrickTowerScene extends BaseScene {

	constructor() {
		super();
	}

	setScene() {
		let brickWall = BrickTowerScene.createBrickTower(21, 10);
		this.scene.add(brickWall);
	}

	static createBrickTower(numLayers = 4, minRadius = 5) {
		const brickWall = new THREE.Group();

		const maxRadius = minRadius * 1.3;

		for (let layer = 0; layer < numLayers; layer++) {
			const y = layer - (numLayers / 2);
			let offset = (layer % 2 === 0);

			let radius = minRadius;

			const frac = layer/numLayers;

			if (frac >= 0.7) {
				radius = maxRadius;
			} else if (frac > 0.5) {
				radius = ((maxRadius - minRadius) * (frac - 0.5) * 5) + minRadius
			}

			console.log(layer, frac, radius);

			let brickLayer = this.createBrickLayer(radius, offset);
			brickLayer.position.y = y;
			brickWall.add(brickLayer);
		}

		for (let layer = numLayers; layer < numLayers + 2; layer++) {
			const y = layer - (numLayers / 2);

			let brickLayer = this.createBrickLayer(maxRadius, false, 1);
			brickLayer.position.y = y;
			brickWall.add(brickLayer);
		}

		return brickWall;
	}

	static createBrickLayer(radius, offset, skip = 0) {
		const bricksPerLayer = Math.round((radius + 1) * Math.PI);

		const brickLayer = new THREE.Group();

		// for (let i = 0; i < bricksPerLayer; i += skip + 1) {
		for (let i = 0; i < bricksPerLayer; i++) {
			let rot = (i / bricksPerLayer) * (Math.PI * 2);

			if (offset) {
				rot += (0.5 / bricksPerLayer) * (Math.PI * 2);
			}

			const x = Math.cos(rot) * radius;
			const y = 0;
			const z = Math.sin(rot) * radius;

			brickLayer.add(BrickTowerScene.createBrick(x, y, z, rot + Math.PI / 2));
			if (skip > 0) {
				i+= skip;
			}
		}
		return brickLayer;
	}

	static createBrick(x, y, z, rotation) {
		const brick = new Brick(2, 1, 2);

		brick.position.set(x, y, z);
		brick.rotateY(-rotation);
		return brick;
	}

}
