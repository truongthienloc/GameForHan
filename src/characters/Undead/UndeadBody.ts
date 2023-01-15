import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';

import * as configEnemies from '../../configs/configEnemies02';

type Sprite = Phaser.Physics.Arcade.Sprite;

let configChar: { UNDEAD_SCALE_BODY; UNDEAD_SCALE_OFFSET; UNDEAD_SCALE_CHAR };

export default class UndeadBody implements IComponent {
    private sprite!: Sprite;
    private body = { width: 0, height: 0 };

    public stateMachine: StateMachine;

    constructor() {
        configChar = configEnemies;
        this.stateMachine = new StateMachine(this);
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;

        this.sprite.setScale(configChar.UNDEAD_SCALE_CHAR);

        const { width: bodyWidth, height: bodyHeight } = this.sprite.body;
        this.body = {
            width: bodyWidth,
            height: bodyHeight,
        };

        this.stateMachine
            .addState('default', {
                onEnter: this.defaultOnEnter,
            })
            .addState('idle-or-death', {
                onEnter: this.idleDeathOnEnter,
            })
            .setState('idle-or-death');
    }

    private makeBody(): void {
        const { width: bodyWidth, height: bodyHeight } = this.body;
        const { width: scaleWidth, height: scaleHeight } =
            configChar.UNDEAD_SCALE_BODY;
        const { width: scaleOffsetWidth, height: scaleOffsetHeight } =
            configChar.UNDEAD_SCALE_OFFSET;

        const BODY_WIDTH = bodyWidth * scaleWidth;
        const BODY_HEIGHT = bodyHeight * scaleHeight;

        this.sprite.body.setSize(BODY_WIDTH, BODY_HEIGHT);

        this.sprite.body.setOffset(
            BODY_WIDTH * scaleOffsetWidth,
            BODY_HEIGHT * scaleOffsetHeight,
        );
    }

    private defaultOnEnter(): void {
        configChar = {
            ...configChar,
            UNDEAD_SCALE_BODY: configEnemies.UNDEAD_SCALE_BODY,
            UNDEAD_SCALE_OFFSET: configEnemies.UNDEAD_SCALE_OFFSET,
        };

        this.makeBody();
    }

    private idleDeathOnEnter(): void {
        const UNDEAD_SCALE_OFFSET_DEATH = {
            ...configEnemies.UNDEAD_SCALE_OFFSET_DEATH,
        };
        if (this.sprite.flipX) {
            UNDEAD_SCALE_OFFSET_DEATH.width -= 0.65;
        }

        configChar = {
            ...configChar,
            UNDEAD_SCALE_BODY: configEnemies.UNDEAD_SCALE_BODY_DEATH,
            UNDEAD_SCALE_OFFSET: UNDEAD_SCALE_OFFSET_DEATH,
        };

        this.makeBody();
    }
}
