import Phaser from 'phaser';
import ComponentService, {
    IComponent,
    Constructor,
} from '~/utils/ComponentService';
import { Controller } from '~/configs/types';

export default class HurtComponent implements IComponent {
    private spriteController!: Controller;
    private controllerConstructor: Constructor;

    constructor(controllerConstructor: Constructor) {
        this.controllerConstructor = controllerConstructor;
    }

    init(go: Phaser.GameObjects.GameObject, components: ComponentService) {
        this.spriteController = components.findComponent(
            go,
            this.controllerConstructor,
        ) as Controller;
    }

    takeDamage(damage: number) {
        this.spriteController.takeDamage(damage);
    }
}
