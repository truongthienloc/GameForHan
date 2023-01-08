import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';
import sceneEvents from '~/events/sceneEvents';

import conversation from './Conversation';

type Sprite = Phaser.Physics.Arcade.Sprite;
type Cursors = Phaser.Types.Input.Keyboard.CursorKeys;

export default class HanScript implements IComponent {
    private scene?: Phaser.Scene;
    private sprite!: Sprite;
    private cursors!: Cursors;
    private stateMachine: StateMachine;

    private nextScript: string = 'script_01';
    private countTime: number = 0;
    static WAIT_TIME: number = 1000;

    private script: { speech: string; name?: string; avatar?: string }[] = [];
    private iScript: number = 0;

    constructor(scene?: Phaser.Scene) {
        this.scene = scene;

        this.stateMachine = new StateMachine(this);
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.sprite = go as Sprite;
        this.sprite.play('Han-idle');

        this.scene = this.scene || go.scene;

        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.J,
        }) as Cursors;

        this.stateMachine
            .addState('pending', {
                onEnter: this.pendingOnEnter,
            })
            .addState('script_01', {
                onEnter: this.script01OnEnter,
                onUpdate: this.script01OnUpdate,
            })
            .addState('script_02', {
                onEnter: this.script02OnEnter,
            })
            .addState('script_03', {
                onEnter: this.script03OnEnter,
                onUpdate: this.script03OnUpdate,
            })
            .addState('script_04', {
                onEnter: this.script04OnEnter,
            })
            .setState('pending');
    }

    update(dt: number): void {
        this.stateMachine.update(dt);
    }

    private pendingOnEnter(): void {
        sceneEvents.once(
            'next_script',
            () => {
                this.stateMachine.setState(this.nextScript);
            },
            this,
        );
    }

    private script01OnEnter(): void {
        this.countTime = 0;
        this.script = conversation.script01;
        this.iScript = 0;

        sceneEvents.emit(
            'speech',
            this.script[0].speech,
            this.script[0].name,
            this.script[0].avatar,
        );
    }

    private script01OnUpdate(dt: number): void {
        // console.log("this.countTime");

        if (this.countTime < HanScript.WAIT_TIME) {
            this.countTime += dt;
            return;
        }

        const nextCursor = Phaser.Input.Keyboard.JustDown(this.cursors.space);
        if (nextCursor) {
            this.iScript++;
            this.countTime = 0;
            if (this.iScript < this.script.length) {
                const i = this.iScript;
                sceneEvents.emit(
                    'speech',
                    this.script[i].speech,
                    this.script[i].name,
                    this.script[i].avatar,
                );
            } else {
                sceneEvents.emit('bubble_clear');
                this.nextScript = 'script_02';
                this.stateMachine.setState('script_02');
            }
        }
    }

    private script02OnEnter(): void {
        const speed = 150;
        this.sprite.play('Han-run');
        this.sprite.setVelocityX(speed);
        this.scene?.tweens.addCounter({
            duration: 5500,
            onComplete: () => {
                this.sprite.setVelocityX(0);
                this.stateMachine.setState('script_03');
            },
        });
    }

    private script03OnEnter(): void {
        this.sprite.play('Han-idle');
        this.countTime = 0;
        this.script = conversation.script03;
        this.iScript = 0;

        sceneEvents.emit('speech', this.script[0].speech, this.script[0].name);
    }

    private script03OnUpdate(dt: number): void {
        if (this.countTime < HanScript.WAIT_TIME) {
            this.countTime += dt;
            return;
        }

        const nextCursor = Phaser.Input.Keyboard.JustDown(this.cursors.space);
        if (nextCursor) {
            this.iScript++;
            this.countTime = 0;
            if (this.iScript < this.script.length) {
                const i = this.iScript;
                sceneEvents.emit(
                    'speech',
                    this.script[i].speech,
                    this.script[i].name,
                    this.script[i].avatar,
                );
            } else {
                sceneEvents.emit('bubble_clear');
                this.nextScript = 'script_04';
                this.stateMachine.setState('script_04');
            }
        }
    }

    private script04OnEnter(): void {
        const speed = 150;
        this.sprite.play('Han-run');
        this.sprite.setVelocityX(speed);
        this.scene?.tweens.addCounter({
            duration: 4000,
            onComplete: () => {
                this.sprite.setVelocityX(0);
                // this.scene?.scene.start()
            },
        });
    }
}
