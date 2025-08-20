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
    this.isGlowEffect = biomeType === BiomeType.NONE;

    // Posiziona la cella
    this.x = x * size;
    this.y = y * size;

    this.render();
  }

  private render() {
    this.clear();

    if (this.isGlowEffect) {
      // Disegna l'effetto glow
      this.fill({
        color: 0xffffff,
        alpha: 0.4,
      });
      this.rect(0, 0, this.cellSize, this.cellSize);
      this.fill();
      this.stroke({
        width: 2,
        color: 0xffffff,
        alpha: 0.6
      });
    } else {
      // Disegna la cella normale con il bioma
      this.fill(this.getBiomeColor(this.biomeType));
      this.rect(0, 0, this.cellSize, this.cellSize);
      this.fill();

      // Aggiungi sempre un bordo sottile per la griglia
      this.stroke({
        width: 1,
        color: 0x000000
      });
      this.rect(0, 0, this.cellSize, this.cellSize);
    }
  }

  private getBiomeColor(biomeType: BiomeType): number {
    switch (biomeType) {
      case BiomeType.GRASS:
        return 0x90EE90; // Verde chiaro
      case BiomeType.FOREST:
        return 0x228B22; // Verde foresta
      case BiomeType.SAND:
        return 0xf2df8a; // Giallo chiaro
      case BiomeType.WATER:
        return 0x4287f5; // Blu acqua
      default:
        return 0x808080; // Grigio come fallback
    }
  }

  // public getBiome(): BiomeType {
  //   return this.biomeType;
  // }

  /** Dice se la cella è attraversabile */
  public isWalkable(): boolean {
    switch (this.biomeType) {
      case BiomeType.WATER:
        return false; // acqua = bloccata
      default:
        return true;  // il resto = libero
    }
  }
}
