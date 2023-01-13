import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';

export default class UndeadAnims implements IComponent {
    private scene?: Phaser.Scene;

    constructor(scene?: Phaser.Scene) {
        this.scene = scene;
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        const scene = this.scene || go.scene;
        const anims = scene.anims;

        anims.create({
            key: 'Undead-idle',
            frames: anims.generateFrameNames('Undead', {
                prefix: 'Undead_idle_',
                suffix: '.png',
                start: 1,
                end: 18,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: -1,
        });
        anims.create({
            key: 'Undead-walk',
            frames: anims.generateFrameNames('Undead', {
                prefix: 'Undead_walk_',
                suffix: '.png',
                start: 1,
                end: 20,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: -1,
        });
        anims.create({
            key: 'Undead-death',
            frames: anims.generateFrameNames('Undead', {
                prefix: 'Undead_death_',
                suffix: '.png',
                start: 1,
                end: 13,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
        anims.create({
            key: 'Undead-hurt',
            frames: anims.generateFrameNames('Undead', {
                prefix: 'Undead_hurt_',
                suffix: '.png',
                start: 1,
                end: 16,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
        anims.create({
            key: 'Undead-attack',
            frames: anims.generateFrameNames('Undead', {
                prefix: 'Undead_attack_',
                suffix: '.png',
                start: 1,
                end: 20,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
    }
}
