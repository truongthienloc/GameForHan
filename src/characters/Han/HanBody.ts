import ComponentService, { IComponent } from '~/utils/ComponentService';
import Phaser from 'phaser';

import * as configChar01 from '~/configs/configCharacter01';
import * as configChar02 from '~/configs/configCharacter02';

type Sprite = Phaser.Physics.Arcade.Sprite;

let configChar: {SCALE_BODY, SCALE_OFFSET, SCALE_CHAR};

export default class HanBody implements IComponent {
    private sprite!: Sprite;

    constructor(type?: string) {
        if (!type || type === '01') {
            configChar = configChar01;
        }
        else if (type === '02') {
            configChar = configChar02;
        }
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;

        this.sprite.setScale(configChar.SCALE_CHAR);

        const { width: bodyWidth, height: bodyHeight } = this.sprite.body;
        const { width: scaleWidth, height: scaleHeight } =
            configChar.SCALE_BODY;
        const { width: scaleOffsetWidth, height: scaleOffsetHeight } =
            configChar.SCALE_OFFSET;

        const BODY_WIDTH = bodyWidth * scaleWidth;
        const BODY_HEIGHT = bodyHeight * scaleHeight;

        this.sprite.body.setSize(BODY_WIDTH, BODY_HEIGHT);

        this.sprite.body.setOffset(
            BODY_WIDTH * scaleOffsetWidth,
            BODY_HEIGHT * scaleOffsetHeight,
        );
    }
}
