import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        // Load images
        this.load.image('start_bg', 'images/start_bg(288 x 208).png');
        this.load.image('Han_avatar', 'images/Han.png');
        this.load.image('Loc_avatar', 'images/Loc.png');
        this.load.image('Wang_avatar', 'images/Wang.png');

        // Load tiles
        this.load.image('house_platformer', 'tiles/House-tileset(30 x 30).png');
        this.load.image('house_bedroom', 'tiles/House-bedroom(30 x 30).png');
        this.load.image(
            'house_livingroom',
            'tiles/House-livingroom(30 x 30).png',
        );

        this.load.image(
            'Grassland_platformer',
            'tiles/Grassland_platformer(16 x 16).png',
        );
        this.load.image(
            'Grassland_entities',
            'tiles/Grassland_entities(16 x 16).png',
        );

        // Load characters
        this.load.atlas(
            'Han',
            'characters/Han/Han.png',
            'characters/Han/Han.json',
        );

        this.load.atlas(
            'Undead',
            'characters/Undead/Undead.png',
            'characters/Undead/Undead.json',
        );
        this.load.atlas(
            'LTH',
            'characters/LTH/LTH.png',
            'characters/LTH/LTH.json',
        );

        // Load tilemaps
        this.load.tilemapTiledJSON('Map01_House', 'maps/Map01_House.json');
        this.load.tilemapTiledJSON(
            'Map02_Grassland',
            'maps/Map02_Grassland.json',
        );

        // Load audiosz
        this.load.audio('start_music', 'audios/musics/start_mc.ogg');
    }

    create() {
        this.scene.start('grassland');
    }
}
