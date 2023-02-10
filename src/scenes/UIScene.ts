import Phaser from 'phaser';

import SpeechBubble from '~/components/SpeechBubble';
import UIHealthBar from '~/components/UIHealthBar';
import sceneEvents from '~/events/sceneEvents';

export default class UIScene extends Phaser.Scene {
    private speechBubble!: SpeechBubble;
    private uiHealthBar!: UIHealthBar;

    constructor() {
        super('ui');
    }

    init(): void {
        this.speechBubble = new SpeechBubble(this);
        this.uiHealthBar = new UIHealthBar(this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('speech', this.handleSpeechEvent, this);
            sceneEvents.off('bubble_clear', this.handleBubbleClear, this);
            sceneEvents.off('set_hp', this.handleSetHP, this);
            sceneEvents.off('remove_hp', this.handleRemoveHP, this);
        });
    }

    create() {
        sceneEvents.on('speech', this.handleSpeechEvent, this);
        sceneEvents.on('bubble_clear', this.handleBubbleClear, this);
        sceneEvents.on('set_hp', this.handleSetHP, this);
        sceneEvents.on('remove_hp', this.handleRemoveHP, this);
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

    private handleSetHP(curHP: number, maxHP: number): void {
        this.uiHealthBar.setHP(curHP, maxHP);
    }

    private handleRemoveHP(): void {
        this.uiHealthBar.remove();
    }
}
