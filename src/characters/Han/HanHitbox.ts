import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';

import { Hitbox } from '~/configs/types';

type Sprite = Phaser.Physics.Arcade.Sprite;
type Group = Phaser.Physics.Arcade.Group;

const HITBOX = {
    SPEAR: {
        WIDTH: 1.25,
        HEIGHT: 0.75,
    },
};

export default class HanHitbox implements IComponent {
    private sprite!: Sprite;

    private px: number;
    private heroDamage: Group;
    private hanSpear!: Hitbox;

    constructor(heroDamage: Group, px: number) {
        this.px = px;
        this.heroDamage = heroDamage;
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;
        const scene = this.sprite.scene;

        const hSpearWidth = HITBOX.SPEAR.WIDTH * this.px;
        const hSpearHeight = HITBOX.SPEAR.HEIGHT * this.px;

        const hanSpear = scene.add
            .rectangle(0, 0, hSpearWidth, hSpearHeight, 0x000, 0)
            .setOrigin(0, 0.4) as unknown as Hitbox;

        this.hanSpear = scene.physics.add.existing(hanSpear, false);

        scene.physics.accelerateTo(this.hanSpear, 0, 0, 0, 0, 0);

        // scene.physics.world.add(this.hanSpear.body);

        // this.heroDamage.add(this.hanSpear);
    }

    start(): void {}

    public createSpearHitbox(): void {
        if (this.sprite.flipX) {
            this.hanSpear.setOrigin(1, 0.4);
        } else {
            this.hanSpear.setOrigin(0, 0.4);
        }
        this.hanSpear.setPosition(this.sprite.x, this.sprite.y);
    }

    public clearHitbox(): void {}
}
