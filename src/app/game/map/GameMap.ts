import { Container } from "pixi.js";
import { createNoise2D } from "simplex-noise";
import { BiomeType } from "./BiomeType";
import { MapCell } from "./MapCell";

export class GameMap extends Container {
  private cells: MapCell[][] = [];
  private mapWidth: number;   // larghezza della mappa in pixel
  private mapHeight: number;  // altezza della mappa in pixel
  public cellSize: number;    // dimensione calcolata delle celle

  constructor(cellsX: number, cellsY: number, screenWidth: number, screenHeight: number) {
    super();

    // Usa le dimensioni dello schermo per la mappa
    this.mapWidth = screenWidth;
    this.mapHeight = screenHeight;

    // Calcola la dimensione delle celle basata sulla dimensione della mappa
    this.cellSize = Math.min(
      this.mapWidth / cellsX,
      this.mapHeight / cellsY
    );

    this.generateMap(cellsX, cellsY);
  }

  private generateMap(width: number, height: number) {
    const noise2D = createNoise2D();
    const scale = 0.1; // Controlla la "zoomata" del noise (valori più bassi = pattern più ampi)

    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        // Genera un valore di rumore tra -1 e 1
        const noiseValue = noise2D(x * scale, y * scale);
        // Mappa il valore di rumore a un bioma
        const biomeType = this.getBiomeFromNoise(noiseValue);

        const cell = new MapCell(x, y, this.cellSize, biomeType);
        this.cells[y][x] = cell;
        this.addChild(cell);
      }
    }
  }

  /*
   * Genera un bioma sulla base di un noise value
   * Mappa i valori di rumore (-1 to 1) ai biomi
   */
  private getBiomeFromNoise(noiseValue: number): BiomeType {
    // Puoi regolare questi valori per ottenere distribuzioni diverse
    if (noiseValue < -0.6) {
      return BiomeType.WATER;
    } else if (noiseValue < -0.5) {
      return BiomeType.SAND;
    } else if (noiseValue < 0.4) {
      return BiomeType.GRASS;
    } else {
      return BiomeType.FOREST;
    }
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
