import * as THREE from 'three';
import {Brick} from "../geometry/Brick";
import {BaseScene} from "./BaseScene";

export class BrickTowerScene extends BaseScene {

	constructor() {
		super();
	}

	setScene() {
		let brickWall = BrickTowerScene.createBrickTower(8, 18, 5);
		this.scene.add(brickWall);
	}

	static createBrickTower(numLayers = 4, bricksPerLayer = 10, radius = 5) {
		const brickWall = new THREE.Group();

		for (let layer = 0; layer < numLayers; layer++) {
			const y = layer - (numLayers / 2);

			for (let i = 0; i < bricksPerLayer; i++) {
				let rot = (i / bricksPerLayer) * (Math.PI * 2);

				if (layer % 2 === 0) {
					rot += (0.5 / bricksPerLayer) * (Math.PI * 2);
				}

				const x = Math.cos(rot) * radius;
				const z = Math.sin(rot) * radius;

				brickWall.add(BrickTowerScene.createBrick(x, y, z, rot + Math.PI/2));
			}
		}

		return brickWall;
	}

	static createBrick(x, y, z, rotation) {
		const brick = new Brick(2, 1, 2);

		brick.position.set(x, y, z);
		brick.rotateY(-rotation);
		return brick;
	}

}
