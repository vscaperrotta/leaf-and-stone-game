import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import { Container } from "pixi.js";

import { TemporaryActions } from "../../actions/temporary_actions";
import { engine } from "../../getEngine";
import { GameMap } from "../../game/map/GameMap";
import { GameUnit } from "../../game/unit/GameUnit";

import { PausePopup } from "../../popups/PausePopup";

/** The screen that holds the app */
export class MainScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  public mainContainer: Container;
  private gameMap: GameMap;
  private actions: TemporaryActions;
  private paused = false;

  constructor() {
    super();

    // Disabilita il menu contestuale del click destro
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);

    // Crea la mappa di gioco (32x32 celle)
    const app = engine();
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;
    this.gameMap = new GameMap(16, 16, screenWidth, screenHeight);
    this.mainContainer.addChild(this.gameMap);

    const cellSize = this.gameMap.cellSize;
    const unitsQuantity = 3; // Numero di unità da generare

    // Creazione unità di gioco
    const x = 0; // Posizione fissa per ora
    const y = 0; // Posizione fissa per ora
    const gameUnit = new GameUnit(x, y, cellSize, unitsQuantity);
    this.mainContainer.addChild(gameUnit);

    // Crea il gestore delle azioni temporanee (pulsanti pausa e impostazioni)
    this.actions = new TemporaryActions();
    this.addChild(this.actions);
  }

  /** Prepare the screen just before showing */
  public prepare() { }

  /** Update the screen */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: Ticker) {
    if (this.paused) return;
    // Per ora non abbiamo niente da aggiornare
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause() {
    this.mainContainer.interactiveChildren = false;
    this.paused = true;
  }

  /** Resume gameplay */
  public async resume() {
    this.mainContainer.interactiveChildren = true;
    this.paused = false;
  }

  /** Fully reset */
  public reset() { }

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    // Aggiorna la posizione dei pulsanti
    this.actions.resize(width);

    // Centra il container principale
    this.mainContainer.x = Math.floor(width * 0.5);
    this.mainContainer.y = Math.floor(height * 0.5);

    // La mappa è un figlio del container principale, quindi deve essere centrata rispetto al suo punto di origine
    this.gameMap.position.set(-this.gameMap.width * 0.5, -this.gameMap.height * 0.5);
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.5 });

    const elementsToAnimate = this.actions.getButtonsToAnimate();

    let finalPromise!: AnimationPlaybackControls;
    for (const element of elementsToAnimate) {
      element.alpha = 0;
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: "backOut" },
      );
    }

    await finalPromise;
    // La mappa è già visibile, non serve altro
  }

  /** Hide screen with animations */
  public async hide() { }

  /** Auto pause the app when window go out of focus */
  public blur() {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup);
    }
  }
}
