import Phaser from 'phaser';
import short from 'short-uuid';
import ComponentService, { IComponent } from '~/utils/ComponentService';

import HurtComponent from './HurtComponent';

import { Sprite, Group, GameObject, Hitbox } from '~/configs/types';

export default class DamageComponent implements IComponent {
    private sprite!: Sprite;
    private enemies: Group;
    private scene!: Phaser.Scene;

    private components!: ComponentService;

    private hitboxes: Map<string, Hitbox>;

    constructor(enemies: Group) {
        this.enemies = enemies;
        this.hitboxes = new Map();
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;
        this.scene = go.scene;
        this.components = components;
    }

    destroy(): void {
        this.removeAllHitbox();
    }

    public addHitbox(
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        damage = 0,
        ox = 0,
        oy = 0.5,
    ): string {
        const hitbox = this.scene.add.rectangle(
            this.sprite.x + x,
            this.sprite.y + y,
            width,
            height,
            0xffffff,
            0,
        ) as Hitbox;
        hitbox.setOrigin(ox, oy);
        hitbox.damage = damage;
        const id = short.generate();

        this.hitboxes.set(id, hitbox);

        this.scene.physics.add.existing(hitbox, true);
        hitbox.overlap = this.scene.physics.add.overlap(
            hitbox,
            this.enemies,
            this.handleHitboxOverlap,
            undefined,
            this,
        );

        return id;
    }

    public removeHitbox(id: string): void {
        const hitbox = this.hitboxes.get(id);
        hitbox?.overlap.destroy();
        hitbox?.destroy();
        this.hitboxes.delete(id);
    }

    public removeAllHitbox(): void {
        const hitboxes = this.hitboxes.entries();
        for (const [key, hitbox] of hitboxes) {
            hitbox.overlap.destroy();
            hitbox.destroy();
        }

        this.hitboxes.clear();
    }

    private handleHitboxOverlap(hitbox: GameObject, enemy: GameObject): void {
        const _hitbox = hitbox as Hitbox;
        const hurtComponent = this.components.findComponent(
            enemy,
            HurtComponent,
        ) as HurtComponent;

        const damage = _hitbox.damage;
        hurtComponent.takeDamage(damage);
    }
}
