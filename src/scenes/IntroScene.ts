import Phaser from "phaser";
import ComponentService from "~/utils/ComponentService";

import HanController from "~/characters/Han/HanController";

import * as config from "../configs/configMap01";

export default class IntroScene extends Phaser.Scene
{
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private components!: ComponentService;

    constructor() 
    {
        super("intro");
    }

    init(): void 
    {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.components = new ComponentService();
    }

    create(): void 
    {
        // TODO: Create map & scale map
        const map = this.make.tilemap({ key: "Map01_House" });
        map.setBaseTileSize(config.TILE_WIDTH_GAME, config.TILE_WIDTH_GAME);

        // TODO: Create tiles
        const tileHousePlatformer = map.addTilesetImage("House-tileset", "house_platformer");
        const tileBedroom = map.addTilesetImage("House-bedroom", "house_bedroom");
        const tileLivingroom = map.addTilesetImage("House-living room", "house_livingroom");

        // TODO: Create layers & scale layer
        const TINT_BEDROOM = 0xffaaff;
        const TINT_LIVINGROOM = 0x00aaff;

        map.createLayer("background_bedroom", tileHousePlatformer)
            .setCollisionByProperty({ collides: true })
            .forEachTile(tile => {
                tile.tint = TINT_BEDROOM;
            });

        map.createLayer("background_livingroom", tileHousePlatformer)
            .setCollisionByProperty({ collides: true })
            .forEachTile(tile => {
                tile.tint = TINT_LIVINGROOM;
            });
        
        const platform = map.createLayer("platform", [
            tileHousePlatformer, tileBedroom, tileLivingroom
        ]).setCollisionByProperty({ collides: true });

        map.setLayerTileSize(config.TILE_WIDTH_GAME, config.TILE_WIDTH_GAME, "platform");
        map.setLayerTileSize(config.TILE_WIDTH_GAME, config.TILE_WIDTH_GAME, "background_bedroom");
        map.setLayerTileSize(
            config.TILE_WIDTH_GAME, config.TILE_WIDTH_GAME, "background_livingroom"
        );

        // TODO: Get character
        const objects = map.getObjectLayer("objects");
        const obj = objects.objects[0];
        const { x: mx = 0, y: my = 0 } = obj;
        
        const x = mx * config.mulPx;
        const y = my * config.mulPx;
        
        this.player = this.physics.add.sprite(x, y, "Han")
            .setScale(config.SCALE_CHAR);
        this.components.addComponent(this.player, new HanController(this));
        
        this.physics.add.collider(platform, this.player);

        // TODO: Change background color
        this.cameras.main.setBackgroundColor(0xd8d8d8);

        // TODO: Set up camera
        const MAP_WIDTH = map.width * config.TILE_WIDTH_GAME;
        const MAP_HEIGHT = map.height * config.TILE_WIDTH_GAME;

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        // this.cameras.main.useBounds = true;
        // this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        
    }

    update(time: number, delta: number): void 
    {
        this.components.update(delta);
    }
}