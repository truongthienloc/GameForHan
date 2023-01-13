import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';

import UndeadBody from './UndeadBody';

type Sprite = Phaser.Physics.Arcade.Sprite;

export default class UndeadController implements IComponent {
    private sprite!: Sprite;
    private stateMachine: StateMachine;

    private stateBody!: StateMachine;

    constructor() {
        this.stateMachine = new StateMachine(this);
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;

        const undeadBody = components.findComponent(
            go,
            UndeadBody,
        ) as UndeadBody;
        this.stateBody = undeadBody.stateMachine;
    }
}
