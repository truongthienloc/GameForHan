import Phaser from "phaser";
import ComponentService, { IComponent } from "../../utils/ComponentService";
import StateMachine from "~/utils/StateMachine";

type Sprite = Phaser.Physics.Arcade.Sprite;
type Cursors = Phaser.Types.Input.Keyboard.CursorKeys;

export default class HanController implements IComponent
{
    private scene: Phaser.Scene;
    private sprite!: Sprite;
    private cursors: Cursors;
    private stateMachine: StateMachine;

    private timeIdle: number = 0;

    constructor(scene: Phaser.Scene) 
    {
        this.scene = scene;
        this.createAnimations();
        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        }) as Cursors;

        this.stateMachine = new StateMachine(this);
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) 
    {
        this.sprite = go as Sprite;

        // TODO: Config stateMachine
        this.stateMachine.addState("idle-0", {
            onEnter: this.idleOnEnter(0),
            onUpdate: this.idleOnUpdate,
        }).addState("idle-1", {
            onEnter: this.idleOnEnter(1)
        }).addState("run", {
            onEnter: this.runOnEnter,
            onUpdate: this.runOnUpdate,
        })
        .setState("idle-0");
    }

    update(dt: number): void 
    {
        this.stateMachine.update(dt);
    }

    private idleOnEnter(type: 0 | 1): () => void
    {
        return () => {
            this.sprite.play(`Han-idle-${type}`);

            if(type === 0) {
                this.timeIdle = 0;
            }
            else {
                this.sprite.once(
                    Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "Han-idle-1", 
                    () => {
                        this.stateMachine.setState("idle-0");
                    }
                );
            }
        }
        
    }

    private idleOnUpdate(dt: number): void 
    {
        this.timeIdle += dt;
        if(this.timeIdle > 2000) {
            this.stateMachine.setState("idle-1")
        }
    }

    private runOnEnter(): void 
    {

    }

    private runOnUpdate(dt: number): void 
    {
        
    }

    private createAnimations(): void 
    {
        const anims = this.scene.anims;

        anims.create({
            key: "Han-idle-0",
            frames: [{ key: "Han", frame: "Han_idle_01.png" }],
        });
        anims.create({
            key: "Han-idle-1",
            frames: anims.generateFrameNames("Han", {
                prefix: "Han_idle_", suffix: ".png",
                start: 1, end: 6, 
                zeroPad: 2
            }),
            frameRate: 8,
            repeat: 0
        });

        anims.create({
            key: "Han-run",
            frames: anims.generateFrameNames("Han", {
                prefix: "Han_run_", suffix: ".png",
                start: 1, end: 9,
                zeroPad: 2
            }),
            frameRate: 8,
            repeat: -1
        })
    }
}