import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';
import { Controller, Animation, AnimationFrame } from '~/configs/types';

import UndeadBody from './UndeadBody';
import HealthBar from '~/components/HealthBar';
import DamageComponent from '~/components/DamageComponent';

import * as configMap02 from '~/configs/configMap02';

let configMap: { px };

type Sprite = Phaser.Physics.Arcade.Sprite;
type ComponentTransform = Phaser.GameObjects.Components.Transform;

export default class UndeadController implements IComponent, Controller {
    private sprite!: Sprite;
    private stateMachine: StateMachine;
    private stateAction: StateMachine;

    private stateBody!: StateMachine;
    private healthbar!: HealthBar;
    private target?: Phaser.GameObjects.GameObject & ComponentTransform;
    private damageComponent!: DamageComponent;

    private countdown: number = 0;
    private timeChangeState: number = 2000;
    private range: number = 1;
    private vision: number = 3;
    private speed: number = 1.1;
    private maxHP: number = 10;
    private damage: number = 5;

    private curHP: number = 10;

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

        this.healthbar = components.findComponent(go, HealthBar) as HealthBar;
        this.damageComponent = components.findComponent(
            go,
            DamageComponent,
        ) as DamageComponent;

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
                onExit: this.attackOnExit,
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
            })
            .addState('stop');
    }

    update(dt: number): void {
        this.stateMachine.update(dt);

        // TODO: Chasing target
        if (!this.stateAction.isCurrentState('stop')) {
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
        }

        this.stateAction.update(dt);
    }

    takeDamage(damage: number): void {
        if (
            this.stateMachine.isCurrentState('death') ||
            this.stateMachine.isCurrentState('hurt')
        ) {
            return;
        }

        const curHP = this.curHP;
        const nextHP = Phaser.Math.Clamp(curHP - damage, 0, this.maxHP);

        this.healthbar.changeHP(nextHP);
        this.curHP = nextHP;

        if (nextHP === 0) {
            // TODO: handle Death
            console.log(`The Undead ${this.sprite.name} is die`);

            this.stateMachine.setState('death');
        } else {
            this.stateMachine.setState('hurt');
        }
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

        this.sprite.on(
            Phaser.Animations.Events.ANIMATION_UPDATE,
            this.startHit,
            this,
        );

        this.sprite.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'Undead-attack',
            () => {
                this.stateMachine.setState('idle');
            },
        );
    }

    private attackOnExit(): void {
        this.damageComponent.removeAllHitbox();
        this.sprite.off(
            Phaser.Animations.Events.ANIMATION_UPDATE,
            this.startHit,
            this,
        );
    }

    private hurtOnEnter(): void {
        this.stateBody.setState('default');
        this.stateAction.setState('stop');
        this.sprite.play('Undead-hurt');
        this.sprite.setVelocityX(0);

        this.sprite.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'Undead-hurt',
            () => {
                this.stateAction.setState('default');
            },
            this,
        );
    }

    private deathOnEnter(): void {
        this.stateBody.setState('idle-or-death');
        this.stateAction.setState('stop');
        this.sprite.play('Undead-death');
        this.sprite.setVelocityX(0);
    }

    private startHit(anim: Animation, frame: AnimationFrame): void {
        if (frame.textureFrame === 'Undead_attack_12.png') {
            this.damageComponent.removeAllHitbox();
        }

        if (frame.textureFrame !== 'Undead_attack_08.png') {
            return;
        }

        const px = configMap.px;
        const ox = this.sprite.flipX ? 1 : 0;
        this.damageComponent.addHitbox(
            0,
            0,
            0.75 * px,
            1.1 * px,
            this.damage,
            ox,
            0.5,
        );
    }
}
