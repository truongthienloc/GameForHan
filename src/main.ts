import Phaser from 'phaser';

/**
 * Import Scene
 */
import Preloader from './scenes/Preloader';
import StartScene from './scenes/StartScene';
import IntroScene from './scenes/IntroScene';
// import GrasslandScene from './scenes/GrasslandScene';
import UIScene from './scenes/UIScene';
import OutroScene from './scenes/OutroScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            // debug: true,
        },
    },
    scene: [Preloader, StartScene, UIScene, IntroScene, OutroScene],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

export default new Phaser.Game(config);
