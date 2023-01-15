import Phaser from 'phaser';
import ComponentService from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';

import HanBody from '~/characters/Han/HanBody';
import HanAnims from '~/characters/Han/HanAnims';
import HanController from '~/characters/Han/HanController';

import UndeadAnims from '~/characters/Undead/UndeadAnims';
import UndeadBody from '~/characters/Undead/UndeadBody';
import UndeadController from '~/characters/Undead/UndeadController';

import HealthBar from '~/components/HealthBar';

import * as configMap from '../configs/configMap02';

type Sprite = Phaser.Physics.Arcade.Sprite;

export default class GrasslandScene extends Phaser.Scene {
    private player!: Sprite;
    private damageHero!: Phaser.Physics.Arcade.Group;
    private enemies!: Phaser.Physics.Arcade.Group;
    private damageEnemies!: Phaser.Physics.Arcade.Group;

    private components!: ComponentService;

    constructor() {
        super('grassland');
    }

    init() {
        this.components = new ComponentService();

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {}, this);
    }

    create() {
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

        const middleLayer = this.add.layer();

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

        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, platform);

        // TODO: Create Objects
        const objects = map.getObjectLayer('objects');
        for (const object of objects.objects) {
            const { name, x: mx = 0, y: my = 0 } = object;
            const x = mx * configMap.mulPx;
            const y = my * configMap.mulPx;

            if (name === 'Han') {
                this.player = this.physics.add.sprite(
                    x + 345,
                    y - 100,
                    'Han',
                    'Han_idle_01.png',
                );
                this.components.addComponent(this.player, new HanBody('02'));
                this.components.addComponent(this.player, new HanAnims(this));
                this.components.addComponent(
                    this.player,
                    new HanController(this, '02'),
                );

                this.cameras.main.startFollow(this.player);
                this.physics.add.collider(this.player, platform);
                middleLayer.add(this.player);
            } else if (name === 'Undead') {
                const undead = this.enemies.create(x, y - 50, 'Undead');

                this.components.addComponent(undead, new UndeadAnims(this));
                this.components.addComponent(undead, new UndeadBody());
                this.components.addComponent(
                    undead,
                    new HealthBar(configMap.TILE_WIDTH_GAME),
                );
                this.components.addComponent(
                    undead,
                    new UndeadController(this.player),
                );

                middleLayer.add(undead);

                // undead.play('Undead-idle');
            }
        }

        const MAP_WIDTH = map.width * configMap.TILE_WIDTH_GAME;
        const MAP_HEIGHT = map.height * configMap.TILE_WIDTH_GAME;

        this.cameras.main.setBackgroundColor(0xaaffff);
        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    }

    update(time: number, delta: number): void {
        this.components.update(delta);
    }
}
