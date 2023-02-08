import Phaser from 'phaser';
import short from 'short-uuid';
import ComponentService, { IComponent } from '~/utils/ComponentService';

import HurtComponent from './HurtComponent';

import { Sprite, Group, GameObject, Hitbox } from '~/configs/types';

export default class DamageComponent implements IComponent {
    private enemies: Group;
    private scene!: Phaser.Scene;

    private components!: ComponentService;

    private hitboxes: Map<string, Hitbox>;

    constructor(enemies: Group) {
        this.enemies = enemies;
        this.hitboxes = new Map();
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.scene = go.scene;
        this.components = components;
    }

    destroy(): void {
        const hitboxes = this.hitboxes.entries();
        for (const [key, hitbox] of hitboxes) {
            hitbox.overlap.destroy();
            hitbox.destroy();
        }

        this.hitboxes.clear();
    }

    public createHitbox(
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        damage = 0,
    ): string {
        const hitbox = this.scene.add.rectangle(
            x,
            y,
            width,
            height,
            0xfff,
            0,
        ) as Hitbox;
        hitbox.damage = damage;
        const id = short.generate();

        this.hitboxes.set(id, hitbox);

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
