import Phaser from 'phaser';

export type Hitbox = Phaser.Types.Physics.Arcade.ImageWithDynamicBody & {
    name: string;
};

export type Sprite = Phaser.Physics.Arcade.Sprite;
