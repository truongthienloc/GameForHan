import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';
import sceneEvents from '~/events/sceneEvents';

import HanAnims from '~/characters/Han/HanAnims';
import HanBody from '~/characters/Han/HanBody';
import HanScript from '~/scripts/map04';

import * as configMap from '~/configs/configMap03';

import { Sprite } from '~/configs/types';

export default class OutroScene extends Phaser.Scene {
    private player!: Sprite;
    private nextScript!: Phaser.Physics.Arcade.StaticGroup;
    private map!: Phaser.Tilemaps.Tilemap;

    private stateScene!: StateMachine;
    private components!: ComponentService;

    constructor() {
        super('outro');
    }

    init() {
        this.stateScene = new StateMachine(this);
        this.components = new ComponentService();

        this.events.once(
            Phaser.Scenes.Events.SHUTDOWN,
            () => {
                this.components.destroy();
            },
            this,
        );
    }

    preload() {
        this.scene.run('ui');
        this.scene.moveAbove(this, 'ui');
    }

    create() {
        this.stateScene
            .addState('init', {
                onEnter: this.initOnEnter,
                onUpdate: this.initOnUpdate,
            })
            .addState('start', {
                onEnter: this.startOnEnter,
            })
            .setState('init');
    }

    update(time: number, delta: number): void {
        this.stateScene.update(delta);
        this.components.update(delta);
    }

    private initOnEnter(): void {
        // TODO: Create map & scale map
        const map = this.make.tilemap({ key: 'Map04_Outro' });
        this.map = map;
        map.setBaseTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
        );

        // TODO: Create tiles
        const tileLabPlatformer = map.addTilesetImage(
            'Lab_platformer',
            'Lab_platformer',
        );

        // TODO: Create layers & scale layer
        const background = map.createLayer('background', tileLabPlatformer);
        const platform = map
            .createLayer('platform', tileLabPlatformer)
            .setCollisionByProperty({ collides: true });

        map.setLayerTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
            'platform',
        );
        map.setLayerTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
            'background',
        );

        // TODO: Get character
        this.nextScript = this.physics.add.staticGroup();
        const objects = map.getObjectLayer('objects');

        for (const obj of objects.objects) {
            const {
                name,
                x: mx = 0,
                y: my = 0,
                width: mw = 0,
                height: mh = 0,
            } = obj;

            const x = mx * configMap.mulPx;
            const y = my * configMap.mulPx;
            const w = mw * configMap.mulPx;
            const h = mh * configMap.mulPx;

            switch (name) {
                case 'Han': {
                    this.player = this.physics.add.sprite(x, y, 'Han');
                    this.components.addComponent(
                        this.player,
                        new HanBody('01'),
                    );
                    this.components.addComponent(
                        this.player,
                        new HanAnims(this),
                    );
                    this.components.addComponent(
                        this.player,
                        new HanScript(this),
                    );

                    this.physics.add.collider(this.player, platform);

                    break;
                }
                case 'next_script': {
                    const nextScript = this.add
                        .rectangle(x, y, w, h, 0x000, 0)
                        .setOrigin(0, 0);
                    this.physics.add.existing(nextScript, true);

                    this.nextScript.add(nextScript);

                    break;
                }
            }
        }

        this.physics.add.overlap(this.player, this.nextScript, (obj1, obj2) => {
            obj2.destroy();
            sceneEvents.emit('next_script');
        });

        // TODO: Set up camera
        const MAP_WIDTH = map.width * configMap.TILE_WIDTH_GAME;
        const MAP_HEIGHT = map.height * configMap.TILE_WIDTH_GAME;

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    }

    private initOnUpdate(dt: number): void {
        this.stateScene.setState('start');
    }

    private startOnEnter(): void {
        const speed = 2;
        this.player.play('Han-run');
        this.player.setVelocityX(speed * configMap.TILE_WIDTH_GAME);

        sceneEvents.once(
            'end_map',
            () => {
                const objects = this.map.getObjectLayer('objects');

                for (const obj of objects.objects) {
                    const {
                        name,
                        x: mx = 0,
                        y: my = 0,
                        width: mw = 0,
                        height: mh = 0,
                    } = obj;

                    const x = mx * configMap.mulPx;
                    const y = my * configMap.mulPx;
                    const w = mw * configMap.mulPx;
                    const h = mh * configMap.mulPx;

                    if (name === 'end_map') {
                        const endMap = this.add
                            .rectangle(x, y, w, h, 0x000, 0)
                            .setOrigin(0, 0);
                        this.physics.add.existing(endMap, true);
                        this.physics.add.overlap(this.player, endMap, () => {
                            endMap.destroy();
                            this.scene.start('start');
                        });
                    }
                }
            },
            this,
        );
    }
}
