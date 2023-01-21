import Phaser from 'phaser';
import ComponentService, { IComponent } from '~/utils/ComponentService';
import StateMachine from '~/utils/StateMachine';
import sceneEvents from '~/events/sceneEvents';

import conversation from './conversation04';

import { Sprite } from '~/configs/types';
import * as configMap from '~/configs/configMap03';
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

    private speedChar = 2;

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
                onUpdate: this.script02OnUpdate,
            })
            .addState('script_03', {
                onEnter: this.script03OnEnter,
                onUpdate: this.script03OnUpdate,
            })
            .addState('script_04', {
                onEnter: this.script04OnEnter,
                onUpdate: this.script04OnUpdate,
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
        this.sprite.play('Han-idle');
        this.sprite.setVelocityX(0);
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
                this.sprite.play('Han-run');
                this.sprite.setVelocityX(
                    this.speedChar * configMap.TILE_WIDTH_GAME,
                );
                this.nextScript = 'script_02';
                this.stateMachine.setState('pending');
            }
        }
    }

    private script02OnEnter(): void {
        this.sprite.play('Han-idle');
        this.sprite.setVelocityX(0);
        this.countTime = 0;
        this.script = conversation.script02;
        this.iScript = 0;

        sceneEvents.emit(
            'speech',
            this.script[0].speech,
            this.script[0].name,
            this.script[0].avatar,
        );
    }

    private script02OnUpdate(dt: number): void {
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
                this.sprite.play('Han-run');
                this.sprite.setVelocityX(
                    this.speedChar * configMap.TILE_WIDTH_GAME,
                );
                this.nextScript = 'script_03';
                this.stateMachine.setState('pending');
            }
        }
    }

    private script03OnEnter(): void {
        this.sprite.play('Han-idle');
        this.sprite.setVelocityX(0);
        this.countTime = 0;
        this.script = conversation.script03;
        this.iScript = 0;

        sceneEvents.emit(
            'speech',
            this.script[0].speech,
            this.script[0].name,
            this.script[0].avatar,
        );
    }

    private script03OnUpdate(dt: number): void {
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
                this.sprite.play('Han-run');
                this.sprite.setVelocityX(
                    this.speedChar * configMap.TILE_WIDTH_GAME,
                );
                this.nextScript = 'script_04';
                this.stateMachine.setState('pending');
            }
        }
    }

    private script04OnEnter(): void {
        this.sprite.play('Han-idle');
        this.sprite.setVelocityX(0);
        this.countTime = 0;
        this.script = conversation.script04;
        this.iScript = 0;

        sceneEvents.emit(
            'speech',
            this.script[0].speech,
            this.script[0].name,
            this.script[0].avatar,
        );
    }

    private script04OnUpdate(dt: number): void {
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
                this.sprite.setFlipX(true);
                this.sprite.play('Han-run');
                this.sprite.setVelocityX(
                    -this.speedChar * configMap.TILE_WIDTH_GAME,
                );
                this.nextScript = 'script_02';
                this.stateMachine.setState('pending');
                sceneEvents.emit('end_map');
            }
        }
    }
}
