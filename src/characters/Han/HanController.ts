import Phaser from 'phaser';
import ComponentService, { IComponent } from '../../utils/ComponentService';
import StateMachine from '~/utils/StateMachine';
import sceneEvents from '~/events/sceneEvents';

import * as configMap02 from '~/configs/configMap02';

let configMap: { px; mulPx; gravity };

type Sprite = Phaser.Physics.Arcade.Sprite;
type Key = Phaser.Input.Keyboard.Key;
type Cursors = Phaser.Types.Input.Keyboard.CursorKeys & {
    attack: Key;
    special: Key;
    dash: Key;
};

export default class HanController implements IComponent {
    private scene: Phaser.Scene;
    private sprite!: Sprite;
    private cursors: Cursors;
    private stateMachine: StateMachine;

    private currentWeapon: string = 'spear';
    private speed: number = 1.5;
    private jumpHigh: number = 2.1;

    constructor(scene: Phaser.Scene, type: string = '02') {
        this.scene = scene;
        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.J,
            special: Phaser.Input.Keyboard.KeyCodes.K,
            dash: Phaser.Input.Keyboard.KeyCodes.L,
        }) as Cursors;

        this.stateMachine = new StateMachine(this);

        if (type === '02') {
            configMap = configMap02;
        }
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;

        // TODO: Config stateMachine
        this.stateMachine
            .addState('disable', {
                onEnter: this.disableOnEnter,
                onExit: this.disableOnExit,
            })
            .addState('idle', {
                onEnter: this.idleOnEnter,
                onUpdate: this.idleOnUpdate,
            })
            .addState('run', {
                onEnter: this.runOnEnter,
                onUpdate: this.runOnUpdate,
            })
            .addState('jump', {
                onEnter: this.jumpOnEnter,
                onUpdate: this.jumpOnUpdate,
            })
            .addState('attack-spear', {
                onEnter: this.attackSpearOnEnter,
            })
            .addState('attack-sword', {
                onEnter: this.attackSwordOnEnter,
            })
            .setState('idle');
    }

    update(dt: number): void {
        this.stateMachine.update(dt);
    }

    private disableOnEnter(): void {
        sceneEvents.once(
            'enable_HanController',
            () => {
                this.stateMachine.setState('idle');
            },
            this,
        );
    }

    private disableOnExit(): void {
        sceneEvents.once(
            'disable_HanController',
            () => {
                this.stateMachine.setState('disable');
            },
            this,
        );
    }

    private idleOnEnter(): void {
        this.sprite.play('Han-idle');
        this.sprite.setVelocityX(0);
    }

    private idleOnUpdate(dt: number): void {
        const left = this.cursors.left;
        const right = this.cursors.right;
        const up = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        const attack = Phaser.Input.Keyboard.JustDown(this.cursors.attack);

        if (left.isDown || right.isDown) {
            this.stateMachine.setState('run');
        }

        if (up) {
            this.stateMachine.setState('jump');
        }

        if (attack) {
            this.stateMachine.setState(`attack-${this.currentWeapon}`);
        }
    }

    private runOnEnter(): void {
        this.sprite.play('Han-run');
    }

    private runOnUpdate(dt: number): void {
        const speed = this.speed * configMap.px;

        const left = this.cursors.left;
        const right = this.cursors.right;
        const up = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        const attack = Phaser.Input.Keyboard.JustDown(this.cursors.attack);

        if (left.isDown) {
            this.sprite.setVelocityX(-speed);
            this.sprite.setFlipX(true);
        } else if (right.isDown) {
            this.sprite.setVelocityX(speed);
            this.sprite.setFlipX(false);
        } else {
            this.stateMachine.setState('idle');
        }

        if (up) {
            this.stateMachine.setState('jump');
        }

        if (attack) {
            this.stateMachine.setState(`attack-${this.currentWeapon}`);
        }
    }

    private jumpOnEnter(): void {
        this.sprite.play('Han-jump');

        const prevState = this.stateMachine.previousStateName;
        if (prevState === 'idle' || prevState === 'run') {
            const g = configMap.gravity,
                h = this.jumpHigh * configMap.px;
            const v = Math.sqrt(2 * g * h);
            console.log(v);

            this.sprite.setVelocityY(-v);
        }
    }

    private jumpOnUpdate(dt: number): void {
        const speed = this.speed * configMap.px;
        const attack = Phaser.Input.Keyboard.JustDown(this.cursors.attack);

        if (this.sprite.body.blocked.down) {
            this.stateMachine.setState('idle');
        }

        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed);
            this.sprite.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed);
            this.sprite.setFlipX(false);
        }

        if (attack) {
            this.stateMachine.setState(`attack-${this.currentWeapon}`);
        }

        if (this.sprite.body.blocked.down) {
            this.stateMachine.setState('idle');
        }
    }

    private attackSpearOnEnter(): void {
        this.sprite.play('Han-attack-spear');
        this.sprite.setVelocity(0);

        this.sprite.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
                'Han-attack-spear',
            () => {
                const prevState = this.stateMachine.previousStateName;
                this.stateMachine.setState(prevState);
            },
            this,
        );
    }

    private attackSwordOnEnter(): void {
        this.sprite.play('Han-attack-sword');
        this.sprite.setVelocity(0);

        this.sprite.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
                'Han-attack-sword',
            () => {
                const prevState = this.stateMachine.previousStateName;
                this.stateMachine.setState(prevState);
            },
            this,
        );
    }
}
