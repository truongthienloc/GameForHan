import Phaser from 'phaser';

// Type of Phaser
export type Sprite = Phaser.Physics.Arcade.Sprite;
export type Group = Phaser.Physics.Arcade.Group;
export type GameObject = Phaser.GameObjects.GameObject;
export type Animation = Phaser.Animations.Animation;
export type AnimationFrame = Phaser.Animations.AnimationFrame;

// Type of game
export type Hitbox = Phaser.GameObjects.Rectangle & {
    damage: number;
    overlap: Phaser.Physics.Arcade.Collider;
};

export interface Controller {
    takeDamage(damage: number): void;
}
