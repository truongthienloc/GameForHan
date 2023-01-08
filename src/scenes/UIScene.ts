import Phaser from 'phaser';

import SpeechBubble from '~/components/SpeechBubble';
import sceneEvents from '~/events/sceneEvents';

export default class UIScene extends Phaser.Scene {
    private speechBubble!: SpeechBubble;

    constructor() {
        super('ui');
    }

    init(): void {
        this.speechBubble = new SpeechBubble(this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('speech', this.handleSpeechEvent, this);
            sceneEvents.off('bubble_clear', this.handleBubbleClear, this);
        });
    }

    create() {
        sceneEvents.on('speech', this.handleSpeechEvent, this);
        sceneEvents.on('bubble_clear', this.handleBubbleClear, this);
    }

    update(time: number, delta: number): void {}

    private handleSpeechEvent(
        speechText: string,
        name?: string,
        avatar?: string,
    ): void {
        // TODO: Make text
        this.speechBubble.speech(speechText, name, avatar);
    }

    private handleBubbleClear(): void {
        this.speechBubble.clear();
    }
}
