import Phaser from 'phaser';

import SpeechBubble from '~/components/SpeechBubble';

export default class UIScene extends Phaser.Scene {
    private speechBubble!: SpeechBubble;

    constructor() {
        super('ui');
    }

    init(): void {
        this.speechBubble = new SpeechBubble(this);
    }

    create() {
        this.speechBubble.speech('Hello');
    }

    update(time: number, delta: number): void {}
}
