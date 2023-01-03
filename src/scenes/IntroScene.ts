import Phaser from 'phaser';
import ComponentService from '~/utils/ComponentService';

import HanController from '~/characters/Han/HanController';
import HanBody from '~/characters/Han/HanBody';

import * as configMap from '../configs/configMap01';
import * as configChar from '../configs/configCharacter';

import { debugDraw } from '~/utils/debug';

export default class IntroScene extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private components!: ComponentService;

    constructor() {
        super('intro');
    }

    init(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.components = new ComponentService();
    }

    preload(): void {
        this.scene.run('ui');
        this.scene.moveAbove(this, 'ui');
    }

    create(): void {
        // TODO: Create map & scale map
        const map = this.make.tilemap({ key: 'Map01_House' });
        map.setBaseTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
        );

        // TODO: Create tiles
        const tileHousePlatformer = map.addTilesetImage(
            'House-tileset',
            'house_platformer',
        );
        const tileBedroom = map.addTilesetImage(
            'House-bedroom',
            'house_bedroom',
        );
        const tileLivingroom = map.addTilesetImage(
            'House-living room',
            'house_livingroom',
        );

        // TODO: Create layers & scale layer
        const TINT_BEDROOM = 0xffaaff;
        const TINT_LIVINGROOM = 0x00aaff;

        map.createLayer('background_bedroom', tileHousePlatformer)
            .setCollisionByProperty({ collides: true })
            .forEachTile((tile) => {
                tile.tint = TINT_BEDROOM;
            });

        map.createLayer('background_livingroom', tileHousePlatformer)
            .setCollisionByProperty({ collides: true })
            .forEachTile((tile) => {
                tile.tint = TINT_LIVINGROOM;
            });

        const platform = map
            .createLayer('platform', [
                tileHousePlatformer,
                tileBedroom,
                tileLivingroom,
            ])
            .setCollisionByProperty({ collides: true });

        map.setLayerTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
            'platform',
        );
        map.setLayerTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
            'background_bedroom',
        );
        map.setLayerTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
            'background_livingroom',
        );

        // TODO: Get character
        const objects = map.getObjectLayer('objects');
        const obj = objects.objects[0];
        const { x: mx = 0, y: my = 0 } = obj;

        const x = mx * configMap.mulPx;
        const y = my * configMap.mulPx;

        this.player = this.physics.add
            .sprite(x, y, 'Han')
            .setScale(configChar.SCALE_CHAR);
        this.components.addComponent(this.player, new HanBody());
        this.components.addComponent(this.player, new HanController(this));

        this.physics.add.collider(this.player, platform);
        debugDraw(platform, this);

        // TODO: Change background color
        // this.cameras.main.setBackgroundColor(0xd8d8d8);

        // TODO: Set up camera
        const MAP_WIDTH = map.width * configMap.TILE_WIDTH_GAME;
        const MAP_HEIGHT = map.height * configMap.TILE_WIDTH_GAME;

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        // this.cameras.main.useBounds = true;
        // this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    }

    update(time: number, delta: number): void {
        this.components.update(delta);
    }
}
