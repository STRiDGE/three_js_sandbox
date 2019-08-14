import * as THREE from 'three';
import {Brick} from "../geometry/Brick";
import {BaseScene} from "./BaseScene";

export class BrickWallScene extends BaseScene {

	constructor() {
		super();
	}

	setScene() {
		let brickWall = BrickWallScene.createBrickWall();
		this.scene.add(brickWall);
	}

	static createBrick(x, y) {
		const brick = new Brick();

		brick.position.set(x, y, 0);
		return brick;
	}

	static createBrickWall() {
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

				brickWall.add(BrickWallScene.createBrick(x, y));
			}
		}

		return brickWall;
	}

}
