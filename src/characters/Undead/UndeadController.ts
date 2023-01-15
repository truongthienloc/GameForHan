import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';

import UndeadBody from './UndeadBody';

import * as configMap02 from '~/configs/configMap02';

let configMap: { px };

type Sprite = Phaser.Physics.Arcade.Sprite;
type ComponentTransform = Phaser.GameObjects.Components.Transform;

export default class UndeadController implements IComponent {
    private sprite!: Sprite;
    private stateMachine: StateMachine;
    private stateAction: StateMachine;

    private stateBody!: StateMachine;
    private target?: Phaser.GameObjects.GameObject & ComponentTransform;

    private countdown: number = 0;
    private timeChangeState: number = 2000;
    private range: number = 1;
    private vision: number = 3;
    private speed: number = 1.1;

    constructor(
        target?: Phaser.GameObjects.GameObject & ComponentTransform,
        type: string = '02',
    ) {
        if (type === '02') {
            configMap = configMap02;
        }

        this.stateMachine = new StateMachine(this);
        this.stateAction = new StateMachine(this);
        this.target = target;
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;

        const undeadBody = components.findComponent(
            go,
            UndeadBody,
        ) as UndeadBody;
        this.stateBody = undeadBody.stateMachine;

        this.stateMachine
            .addState('idle', {
                onEnter: this.idleOnEnter,
            })
            .addState('walk-left', {
                onEnter: this.walkLeftOnEnter,
            })
            .addState('walk-right', {
                onEnter: this.walkRightOnEnter,
            })
            .addState('attack', {
                onEnter: this.attackOnEnter,
            })
            .addState('hurt', {
                onEnter: this.hurtOnEnter,
            })
            .addState('death', {
                onEnter: this.deathOnEnter,
            })
            .setState('idle');

        this.stateAction
            .addState('default', {
                onUpdate: this.defaultOnUpdate,
            })
            .addState('chasing', {
                onUpdate: this.chasingOnUpdate,
            });
    }

    update(dt: number): void {
        this.stateMachine.update(dt);

        // TODO: Chasing target
        if (
            this.target &&
            Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.target.x,
                this.target.y,
            ) <
                this.vision * configMap.px
        ) {
            this.stateAction.setState('chasing');
        } else {
            this.stateAction.setState('default');
        }

        this.stateAction.update(dt);
    }

    private defaultOnUpdate(dt: number): void {
        this.countdown += dt;
        if (this.countdown > this.timeChangeState) {
            this.countdown = 0;

            const stateIndex = Phaser.Math.Between(1, 3);
            if (stateIndex === 1) {
                this.stateMachine.setState('idle');
            } else if (stateIndex === 2) {
                this.stateMachine.setState('walk-left');
            } else if (stateIndex === 3) {
                this.stateMachine.setState('walk-right');
            }
        }
    }

    private chasingOnUpdate(dt: number): void {
        if (!this.target) return;

        if (
            Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.target.x,
                this.target.y,
            ) <
            this.range * configMap.px
        ) {
            this.stateMachine.setState('attack');
        } else if (!this.stateMachine.isCurrentState('attack')) {
            if (this.sprite.x < this.target.x) {
                this.stateMachine.setState('walk-right');
            } else if (this.sprite.x > this.target.x) {
                this.stateMachine.setState('walk-left');
            }
        }
    }

    private idleOnEnter(): void {
        this.stateBody.setState('idle-or-death');
        this.sprite.play('Undead-idle');
        this.sprite.setVelocityX(0);
    }

    private walkLeftOnEnter(): void {
        this.stateBody.setState('default');
        this.sprite.play('Undead-walk');
        this.sprite.setFlipX(true);

        const speed = this.speed * configMap.px;

        this.sprite.setVelocityX(-speed);
    }

    private walkRightOnEnter(): void {
        this.stateBody.setState('default');
        this.sprite.play('Undead-walk');
        this.sprite.setFlipX(false);

        const speed = this.speed * configMap.px;

        this.sprite.setVelocityX(speed);
    }

    private attackOnEnter(): void {
        this.stateBody.setState('default');
        this.sprite.play('Undead-attack');
        this.sprite.setVelocityX(0);

        this.sprite.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'Undead-attack',
            () => {
                this.stateMachine.setState('idle');
            },
        );
    }

    private hurtOnEnter(): void {
        this.stateBody.setState('default');
        this.sprite.play('Undead-hurt');
        this.sprite.setVelocityX(0);
    }

    private deathOnEnter(): void {
        this.stateBody.setState('idle-or-death');
        this.sprite.play('Undead-death');
        this.sprite.setVelocityX(0);
    }
}
