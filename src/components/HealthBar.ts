import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';

type Sprite = Phaser.Physics.Arcade.Sprite;

export default class HealthBar implements IComponent {
    private sprite!: Sprite;
    private graphics?: Phaser.GameObjects.Graphics;

    private px = 0;
    private graphicsWidth: number;
    private graphicsHeight: number;

    private curHP: number = 10;
    private maxHP: number = 10;

    constructor(px: number, maxHP: number = 10) {
        this.px = px;
        this.graphicsWidth = 1.25 * this.px;
        this.graphicsHeight = 0.15 * this.px;
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;
    }

    start(): void {
        const scene = this.sprite.scene;

        this.graphics = scene.add.graphics();

        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(0, 0, this.graphicsWidth, this.graphicsHeight);
    }

    update(dt: number): void {
        if (!this.graphics) {
            return;
        }

        this.graphics.setPosition(
            this.sprite.x - this.graphicsWidth / 2,
            this.sprite.y - this.sprite.body.height / 2 - this.graphicsHeight,
        );
    }

    public changeHP(value: number): void {
        this.curHP = Phaser.Math.Clamp(this.curHP - value, 0, this.maxHP);

        if (!this.graphics) return;

        const percent = this.curHP / this.maxHP;

        this.graphics.clear();
        this.graphics.fillRect(
            0,
            0,
            this.graphicsWidth * percent,
            this.graphicsHeight,
        );
    }

    public isRunOut(): boolean {
        if (this.curHP === 0) {
            return true;
        }

        return false;
    }
}
