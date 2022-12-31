import Phaser from "phaser";
import ComponentService, { IComponent } from "../../utils/ComponentService";

type Sprite = Phaser.Physics.Arcade.Sprite;
type Cursors = Phaser.Types.Input.Keyboard.CursorKeys;

export default class HanController implements IComponent
{
    private scene: Phaser.Scene;
    private sprite!: Sprite;
    private cursors: Cursors;

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
        
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) 
    {
        this.sprite = go as Sprite;
        this.sprite.play("Han-idle-0");
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
                start: 1, end: 6, zeroPad: 2
            }),
            frameRate: 8,
            repeat: -1
        });
    }
}