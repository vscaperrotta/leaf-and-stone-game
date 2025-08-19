import { Container } from "pixi.js";
import { BiomeType } from "./BiomeType";
import { MapCell } from "./MapCell";

export class GameMap extends Container {
  private cells: MapCell[][] = [];
  private readonly mapWidth = 960;  // larghezza fissa della mappa in pixel
  private readonly mapHeight = 640; // altezza fissa della mappa in pixel
  public cellSize: number;         // dimensione calcolata delle celle

  constructor(cellsX: number, cellsY: number) {
    super();

    // Calcola la dimensione delle celle basata sulla dimensione della mappa
    this.cellSize = Math.min(
      this.mapWidth / cellsX,
      this.mapHeight / cellsY
    );

    this.generateMap(cellsX, cellsY);
  }

  private generateMap(width: number, height: number) {
    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        // Per ora generiamo biomi casuali
        const biomeType = this.getRandomBiome();
        const cell = new MapCell(x, y, this.cellSize, biomeType);
        this.cells[y][x] = cell;
        this.addChild(cell);
      }
    }
  }

  private getRandomBiome(): BiomeType {
    const biomes = [
      BiomeType.GRASS,
      BiomeType.FOREST,
      BiomeType.WATER
    ];
    return biomes[Math.floor(Math.random() * biomes.length)];
  }

  public resize(screenWidth: number, screenHeight: number) {
    // Centra la mappa sullo schermo
    this.x = (screenWidth - this.mapWidth) / 2;
    this.y = (screenHeight - this.mapHeight) / 2;
  }

  public getGrid(): number[][] {
    return this.cells.map(row =>
      row.map(cell => (cell.isWalkable() ? 0 : 1))
    );
  }
}
