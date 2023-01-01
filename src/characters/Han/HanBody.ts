import ComponentService, { IComponent } from "~/utils/ComponentService";
import Phaser from "phaser";

import * as configChar from "~/configs/configCharacter";

type Sprite = Phaser.Physics.Arcade.Sprite;

export default class HanBody implements IComponent
{
    private sprite!: Sprite;

    constructor()
    {

    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) 
    {
        this.sprite = go as Sprite;

        const { width: bodyWidth, height: bodyHeight } = this.sprite.body;
        const { width: scaleWidth, height: scaleHeight } = configChar.SCALE_BODY;
        const { width: scaleOffsetWidth, height: scaleOffsetHeight } = configChar.SCALE_OFFSET;

        const BODY_WIDTH = bodyWidth * scaleWidth;
        const BODY_HEIGHT = bodyHeight * scaleHeight;

        this.sprite.body.setSize(BODY_WIDTH, BODY_HEIGHT);

        this.sprite.body.setOffset(BODY_WIDTH * scaleOffsetWidth, BODY_HEIGHT * scaleOffsetHeight);
    }
}