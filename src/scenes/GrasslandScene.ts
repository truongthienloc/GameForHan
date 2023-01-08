import Phaser from 'phaser';
import ComponentService from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';

import * as configMap from '../configs/configMap02';

type Sprite = Phaser.Physics.Arcade.Sprite;

export default class GrasslandScene extends Phaser.Scene {
    private player!: Sprite;

    constructor() {
        super('grassland');
    }

    init() {}

    create() {
        console.log('Grassland');

        const map = this.make.tilemap({ key: 'Map02_Grassland' });
        map.setBaseTileSize(
            configMap.TILE_WIDTH_GAME,
            configMap.TILE_WIDTH_GAME,
        );

        // TODO: create tiles
        const tilesGrasslandPLatform = map.addTilesetImage(
            'Grassland_platformer',
            'Grassland_platformer',
        );
        const tilesGrasslandEntities = map.addTilesetImage(
            'Grassland_entities',
            'Grassland_entities',
        );

        // TODO: render layer
        const TINT_BACKGROUND = 0x8d8d8d;
        const background = map
            .createLayer('background', [
                tilesGrasslandPLatform,
                tilesGrasslandEntities,
            ])
            .forEachTile((tile) => {
                tile.tint = TINT_BACKGROUND;
            });

        const platform = map
            .createLayer('platform', [
                tilesGrasslandPLatform,
                tilesGrasslandEntities,
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
            'background',
        );

        const objects = map.getObjectLayer('objects');
        for (const object of objects.objects) {
            const { name, x: mx = 0, y: my = 0 } = object;
            const x = mx * configMap.mulPx;
            const y = my * configMap.mulPx;

            if (name === 'Han') {
                this.player = this.physics.add.sprite(
                    x,
                    y - 100,
                    'Han',
                    'Han_idle_01.png',
                );

                this.cameras.main.startFollow(this.player);
                this.physics.add.collider(this.player, platform);
            }
        }

        const MAP_WIDTH = map.width * configMap.TILE_WIDTH_GAME;
        const MAP_HEIGHT = map.height * configMap.TILE_WIDTH_GAME;

        this.cameras.main.setBackgroundColor(0xaaffff);
        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    }

    update(time: number, delta: number): void {}
}
