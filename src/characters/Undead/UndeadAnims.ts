import Phaser from "phaser";
import ComponentService, { IComponent } from "~/utils/ComponentService";

export default class UndeadAnims implements IComponent
{
    private scene?: Phaser.Scene;

    constructor(scene?: Phaser.Scene) {

    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        const scene = this.scene || go.scene;
        const anims = scene.anims;

        anims.create({
            key: 'Undead-idle',
            frames: anims.generateFrameNames('Undead', {
                
            })
        })
    }
}