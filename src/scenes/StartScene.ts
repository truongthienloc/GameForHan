import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    private startButton?: Phaser.GameObjects.Image;

    private timer: number = 0;

    constructor() {
        super('start');
    }

    preload() {
        this.load.image('start_btn', 'images/start_btn.png');
    }

    create() {
        // TODO: make background
        this.add.image(0, 0, 'start_bg').setOrigin(0, 0).setScale(3.2);

        // TODO: make animated border
        const border = this.add.graphics();
        this.tweens.addCounter({
            from: 0.1,
            to: 1,
            duration: 1000,
            repeat: -1,
            ease: Phaser.Math.Easing.Sine.InOut,
            yoyo: true,
            onUpdate: (tween) => {
                const value = tween.getValue();

                border.clear();
                border.lineStyle(18, 0xffbb10, value);
                border.strokeRoundedRect(0, 0, 800, 600, 32);
            },
        });

        // TODO: make music
        this.sound
            .add('start_music', {
                loop: true,
                volume: 0.25,
            })
            .play();

        // TODO: make button
        const WIDTH_IMAGE_BTN = 2512;
        const WIDTH_BTN = 150;

        this.startButton = this.add
            .image(400, 400, 'start_btn')
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setScale(WIDTH_BTN / WIDTH_IMAGE_BTN)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.scene.start('intro');
            });
    }

    update(time: number, delta: number): void {
        if (this.timer === -1) {
            return;
        }

        // TODO: Make effect startButton appear
        if (this.timer < 3000) {
            this.timer += delta;
        } else {
            this.timer = -1;
            this.tweens.addCounter({
                from: 0,
                to: 1,
                duration: 1000,
                repeat: 0,
                ease: Phaser.Math.Easing.Sine.InOut,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    this.startButton?.setAlpha(value);
                },
            });
        }
    }
}
