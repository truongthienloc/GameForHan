import Phaser from 'phaser';

export default class SpeechBubble {
    private scene: Phaser.Scene;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        const x = 25,
            y = 10;
        this.graphics = scene.add.graphics({ x: x, y: y });
    }

    public clear(): void {
        this.graphics.clear();
    }

    public speech(quote: string): void {
        this.graphics.clear();
        // TODO: config property
        const width = 750,
            height = 100;

        var bubbleWidth = width;
        var bubbleHeight = height;
        var bubblePadding = 10;
        var arrowHeight = bubbleHeight / 4;

        // var bubble = this.add.graphics({ x: x, y: y });

        //  Bubble shadow
        this.graphics.fillStyle(0x222222, 0.5);
        this.graphics.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        this.graphics.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        this.graphics.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        this.graphics.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        this.graphics.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        //  Calculate arrow coordinates
        var point1X = Math.floor(bubbleWidth / 7);
        var point1Y = bubbleHeight;
        var point2X = Math.floor((bubbleWidth / 7) * 2);
        var point2Y = bubbleHeight;
        var point3X = Math.floor(bubbleWidth / 7);
        var point3Y = Math.floor(bubbleHeight + arrowHeight);

        //  Bubble arrow shadow
        this.graphics.lineStyle(4, 0x222222, 0.5);
        this.graphics.lineBetween(
            point2X - 1,
            point2Y + 6,
            point3X + 2,
            point3Y,
        );

        //  Bubble arrow fill
        this.graphics.fillTriangle(
            point1X,
            point1Y,
            point2X,
            point2Y,
            point3X,
            point3Y,
        );
        this.graphics.lineStyle(2, 0x565656, 1);
        this.graphics.lineBetween(point2X, point2Y, point3X, point3Y);
        this.graphics.lineBetween(point1X, point1Y, point3X, point3Y);

        var content = this.scene.add.text(0, 0, quote, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: bubbleWidth - bubblePadding * 2 },
        });

        var b = content.getBounds();

        content.setPosition(
            this.graphics.x + bubbleWidth / 2 - b.width / 2,
            this.graphics.y + bubbleHeight / 2 - b.height / 2,
        );
    }
}
