import Phaser from 'phaser';

/**
 * Import Scene
 */
import Preloader from './scenes/Preloader';
import StartScene from './scenes/StartScene';
import IntroScene from './scenes/IntroScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		},
	},
	scene: [Preloader, StartScene, IntroScene],
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config);
