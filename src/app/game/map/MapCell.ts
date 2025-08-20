import { Graphics } from "pixi.js";
import { BiomeType } from "./BiomeType";

export class MapCell extends Graphics {
  private readonly biomeType: BiomeType;
  private readonly cellSize: number;
  private readonly isGlowEffect: boolean;

  constructor(x: number, y: number, size: number, biomeType: BiomeType) {
    super();

    this.biomeType = biomeType;
    this.cellSize = size;
    this.isGlowEffect = biomeType === BiomeType.GLOW;

    // Posizoine della cella
    this.x = x * size;
    this.y = y * size;

    this.render();
  }

  private render() {
    this.clear();

    this.rect(0, 0, this.cellSize, this.cellSize);

    if (this.isGlowEffect) {
      // Disegna un leggere layer bianco sopra la cella dove passo con il mouse
      this.drawGlow();
    } else {
      // Disegna la cella normale con il bioma
      this.draw();
    }
  }

  private draw() {
    this.fill(this.getBiomeColor(this.biomeType));
  }

  private drawGlow() {
    this.fill({
      color: 0xffffff,
      alpha: 0.4,
    });
    this.stroke({
      width: 2,
      color: 0xffffff,
      alpha: 0.6
    });
  }

  private getBiomeColor(biomeType: BiomeType): number {
    switch (biomeType) {
      case BiomeType.GRASS:
        return 0x90EE90; // Verde chiaro
      case BiomeType.SAND:
        return 0xf2df8a; // Giallo chiaro
      case BiomeType.WATER:
        return 0x4287f5; // Blu acqua
      default:
        return 0x808080; // Grigio come fallback
    }
  }

  // Definisce se la cella è attraversabile o no
  public isWalkable(): boolean {
    switch (this.biomeType) {
      // Questi sono elementi non attraversabili
      case BiomeType.WATER:
        return false;
      // Tutto il resto è attraversabile
      default:
        return true;
    }
  }

  public getBiomeType(): BiomeType {
    return this.biomeType;
  }
}
