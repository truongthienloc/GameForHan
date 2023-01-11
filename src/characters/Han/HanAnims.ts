import ComponentService, { IComponent } from '~/utils/ComponentService';
import Phaser from 'phaser';

export default class HanAnims implements IComponent {
    private scene?: Phaser.Scene;

    constructor(scene?: Phaser.Scene) {
        this.scene = scene;
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        const scene = this.scene || go.scene;

        const anims = scene.anims;

        anims.create({
            key: 'Han-idle',
            frames: [
                { key: 'Han', frame: 'Han_idle_01.png', duration: 1900 },
                ...anims.generateFrameNames('Han', {
                    prefix: 'Han_idle_',
                    suffix: '.png',
                    start: 1,
                    end: 6,
                    zeroPad: 2,
                }),
            ],
            frameRate: 8,
            repeat: -1,
        });

        anims.create({
            key: 'Han-run',
            frames: anims.generateFrameNames('Han', {
                prefix: 'Han_run_',
                suffix: '.png',
                start: 1,
                end: 9,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: -1,
        });

        anims.create({
            key: 'Han-jump',
            frames: [{ key: 'Han', frame: 'Han_idle_01.png' }],
            repeat: -1
        })

        anims.create({
            key: 'Han-attack-spear',
            frames: anims.generateFrameNames('Han', {
                prefix: 'Han_attack_spear_',
                suffix: '.png',
                start: 1,
                end: 5,
                zeroPad: 2,
            }),
            frameRate: 16,
            repeat: 0,
        });

        anims.create({
            key: 'Han-attack-sword',
            frames: anims.generateFrameNames('Han', {
                prefix: 'Han_attack_sword_',
                suffix: '.png',
                start: 1,
                end: 4,
                zeroPad: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
    }
}
