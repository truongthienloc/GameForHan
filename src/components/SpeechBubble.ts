import Phaser from 'phaser';

const x = 25,
    y = 10;
const width = 750,
    height = 100;
const bubbleHeight = height;
const bubbleWidth = width;
const bubblePadding = 10;
const widthImage = 40;

export default class SpeechBubble {
    private scene: Phaser.Scene;
    private graphics: Phaser.GameObjects.Graphics;
    private content: Phaser.GameObjects.Text;
    private avatar: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.graphics = scene.add.graphics({ x: x, y: y });
        this.content = this.scene.add.text(0, 0, '', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: bubbleWidth - bubblePadding * 2 - widthImage },
        });
        this.avatar = this.scene.add
            .image(x, y, '')
            .setVisible(false)
            .setScale(0.15)
            .setOrigin(0.27, 0.2);
    }

    public clear(): void {
        this.graphics.clear();
        this.content.setText('');
        this.avatar.setVisible(false);
    }

    public speech(quote: string, name?: string, avatar?: string): void {
        this.clear();

        const arrowHeight = bubbleHeight / 4;

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

        if(name) {
            this.content.setText(`${name}: "${quote}"`);
        }
        else {
            this.content.setText(quote);
        }

        const b = this.content.getBounds();

        this.content.setPosition(
            this.graphics.x +
                widthImage -
                bubblePadding / 2 +
                bubbleWidth / 2 -
                b.width / 2,
            this.graphics.y + bubbleHeight / 2 - b.height / 2,
        );

        if (avatar) {
            console.log(avatar);
            this.avatar.setTexture(avatar);
            this.avatar.setVisible(true);
        }
    }
}
