import {BrickWallScene} from './scene/BrickWallScene';

let activeScene = null;
bindButtons();
loadBrickWall();

function bindButtons() {
	//console.log('inside test');
	document.getElementById('btnClear').addEventListener('click', clearOld, false);
	document.getElementById('btnBrickWall').addEventListener('click', loadBrickWall, false);
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



