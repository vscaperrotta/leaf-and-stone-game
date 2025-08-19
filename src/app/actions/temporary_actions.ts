import { FancyButton } from "@pixi/ui";
import { Container } from "pixi.js";
import { engine } from "../getEngine";
import { PausePopup } from "../popups/PausePopup";
import { SettingsPopup } from "../popups/SettingsPopup";

export class TemporaryActions extends Container {
  private pauseButton: FancyButton;
  private settingsButton: FancyButton;

  constructor() {
    super();

    const buttonAnimations = {
      hover: {
        props: {
          scale: { x: 1.1, y: 1.1 },
        },
        duration: 100,
      },
      pressed: {
        props: {
          scale: { x: 0.9, y: 0.9 },
        },
        duration: 100,
      },
    };

    this.pauseButton = new FancyButton({
      defaultView: "icon-pause.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.pauseButton.onPress.connect(() =>
      engine().navigation.presentPopup(PausePopup),
    );
    this.addChild(this.pauseButton);

    this.settingsButton = new FancyButton({
      defaultView: "icon-settings.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.settingsButton.onPress.connect(() =>
      engine().navigation.presentPopup(SettingsPopup),
    );
    this.addChild(this.settingsButton);
  }

  public resize(width: number, height: number) {
    this.pauseButton.x = 30;
    this.pauseButton.y = 30;
    this.settingsButton.x = width - 30;
    this.settingsButton.y = 30;
  }

  public getButtonsToAnimate(): FancyButton[] {
    return [this.pauseButton, this.settingsButton];
  }
}
