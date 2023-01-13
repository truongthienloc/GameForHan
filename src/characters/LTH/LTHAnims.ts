import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';

export default class LTHAnims implements IComponent {
    private scene?: Phaser.Scene;

    constructor(scene?: Phaser.Scene) {
        this.scene = scene;
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        const scene = this.scene || go.scene;
        const anims = scene.anims;

        anims.create({
            key: 'LTH-idle',
            frames: anims.generateFrameNames('LTH', {
                prefix: 'LTH_idle_',
                suffix: '.png',
                start: 1,
                end: 9,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: -1,
        });
        anims.create({
            key: 'LTH_run',
            frames: anims.generateFrameNames('LTH', {
                prefix: 'LTH_run_',
                suffix: '.png',
                start: 1,
                end: 6,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: -1,
        });
        anims.create({
            key: 'LTH_death',
            frames: anims.generateFrameNames('LTH', {
                prefix: 'LTH_death_',
                suffix: '.png',
                start: 1,
                end: 23,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
        anims.create({
            key: 'LTH_hurt',
            frames: anims.generateFrameNames('LTH', {
                prefix: 'LTH_hurt_',
                suffix: '.png',
                start: 1,
                end: 5,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
        anims.create({
            key: 'LTH_attack',
            frames: anims.generateFrameNames('LTH', {
                prefix: 'LTH_attack_',
                suffix: '.png',
                start: 1,
                end: 12,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
    }
}
