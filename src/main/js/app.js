import {BrickWallScene} from './scene/BrickWallScene';
import {BrickWallScene_2} from './scene/BrickWallScene_2';

//new BrickWallScene();

bindButtons();

let activeScene = null;

function bindButtons() {
	//console.log('inside test');
	document.getElementById('btnLoad1').addEventListener('click', load1, false);
	document.getElementById('btnLoad2').addEventListener('click', load2, false);
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

function load1() {
	clearOld();
	activeScene = new BrickWallScene();
}

function load2() {
	clearOld();
	activeScene = new BrickWallScene_2();
}



