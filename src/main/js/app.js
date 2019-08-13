import {BrickWallScene} from './scene/BrickWallScene';
import {BrickTowerScene} from "./scene/BrickTowerScene";

let activeScene = null;
doButtons();
loadBrickTower();

function doButtons() {

	let btnClear = document.createElement("button");
	btnClear.innerHTML = "Clear";
	btnClear.addEventListener('click', clearOld, false);
	document.body.appendChild(btnClear);

	let btnWall = document.createElement("button");
	btnWall.innerHTML = "Wall";
	btnWall.addEventListener('click', loadBrickWall, false);
	document.body.appendChild(btnWall);

	let btnTower = document.createElement("button");
	btnTower.innerHTML = "Tower";
	btnTower.addEventListener('click', loadBrickTower, false);
	document.body.appendChild(btnTower);
}

function clearOld() {
	if (activeScene) {
		// delete activeScene;
		if (typeof activeScene.dispose === "function") {
			activeScene.dispose();
		}

		activeScene = null;
	}
}

function loadBrickWall() {
	clearOld();
	activeScene = new BrickWallScene();
}

function loadBrickTower() {
	clearOld();
	activeScene = new BrickTowerScene();
}



