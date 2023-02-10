import Phaser from 'phaser';

export default class UIHealthBar {
    // private scene: Phaser.Scene;
    private healthBar: Phaser.GameObjects.Graphics;
    private text: Phaser.GameObjects.Text;

    private x = 10;
    private y = 10;
    private width = 200;
    private height = 50;
    private radius = 15;

    constructor(scene: Phaser.Scene) {
        // this.scene = scene;
        this.healthBar = scene.add.graphics({ x: this.x, y: this.y });
        this.text = scene.add.text(this.x, this.y, '', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: this.width - 2 },
        });
    }

    public remove(): void {
        this.healthBar.clear();
        this.text.setText('');
    }

    public setHP(curHP: number, maxHP: number): void {
        const percent = curHP / maxHP;

        this.remove();

        this.healthBar.fillStyle(0xcacdd2);
        this.healthBar.fillRoundedRect(
            0,
            0,
            this.width,
            this.height,
            this.radius,
        );
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRoundedRect(
            0,
            0,
            this.width * percent,
            this.height,
            this.radius,
        );

        this.healthBar.lineStyle(5, 0xfff000);
        this.healthBar.strokeRoundedRect(
            0,
            0,
            this.width,
            this.height,
            this.radius,
        );

        this.text.setText(`${curHP}/${maxHP}`);

        const b = this.text.getBounds();

        this.text.setPosition(
            this.x + 2 + this.width / 2 - b.width / 2,
            this.y + this.height / 2 - b.height / 2,
        );
    }
}
