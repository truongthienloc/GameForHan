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
        });
    }

    create() {
        sceneEvents.on('speech', this.handleSpeechEvent, this);
    }

    update(time: number, delta: number): void {}

    private handleSpeechEvent(name: string, speechText: string): void {
        // TODO: Make text
        this.speechBubble.speech(speechText);
    }
}
