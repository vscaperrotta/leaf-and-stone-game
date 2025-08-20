import { Container, Point, FederatedPointerEvent } from "pixi.js";
import { createNoise2D } from "simplex-noise";
import { BiomeType } from "./BiomeType";
import { MapCell } from "./MapCell";
import { MovementManager } from "../../controls/MovementManager";
import { UnitCell } from "../unit/UnitCell";

export class GameMap extends Container {
  private cells: MapCell[][] = [];
  private mapWidth: number;
  private mapHeight: number;
  public cellSize: number;
  private glowOverlay: MapCell | null = null;
  private movement?: MovementManager;
  private selectedUnit: UnitCell | null = null;

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

    // Rendi il container interattivo per catturare gli eventi
    this.eventMode = 'static';

    this.generateMap(cellsX, cellsY);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.on('click', this.debugCell, this);
    this.on('mousemove', this.glowCell, this);
    this.on('mouseout', this.removeGlow, this);
    this.on('rightclick', this.handleRightClick, this);
  }

  public setMovementManager(movement: MovementManager) {
    this.movement = movement;
  }

  public setSelectedUnit(unit: UnitCell | null) {
    this.selectedUnit = unit;
  }

  private handleRightClick(event: FederatedPointerEvent) {
    if (this.selectedUnit && this.movement && event.button === 2) {
      const goalWorld = {
        x: event.global.x,
        y: event.global.y,
      };
      this.movement.issueMoveToWorld(this.selectedUnit, goalWorld);
    }
  }

  private generateMap(width: number, height: number) {
    const noise2D = createNoise2D();
    // Controlla la "zoomata" del noise (valori più bassi = pattern più ampi)
    const scale = 0.1;

    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        const noiseValue = noise2D(x * scale, y * scale);
        const biomeType = this.getBiomeFromNoise(noiseValue);
        const cell = new MapCell(x, y, this.cellSize, biomeType);
        this.cells[y][x] = cell;
        this.addChild(cell);
      }
    }
    console.log(this.cells)
  }

  // Genera un bioma sulla base di un noise value
  // Mappa i valori di rumore (-1 to 1) ai biomi
  private getBiomeFromNoise(noiseValue: number): BiomeType {
    // Puoi regolare questi valori per ottenere distribuzioni diverse
    if (noiseValue < -0.6) {
      return BiomeType.WATER;
    } else if (noiseValue < -0.5) {
      return BiomeType.SAND;
    } else {
      return BiomeType.GRASS;
    }
  }

  // Ritorna la posizione in px e della tile
  private debugCell(event: FederatedPointerEvent) {
    const gridPosition = this.worldToGrid({
      x: event.global.x,
      y: event.global.y
    });
    const worldPosition = this.gridToWorld({
      x: gridPosition.x,
      y: gridPosition.y
    }, "center");
    console.log(`debugCell: Grid position: ${gridPosition.x}, ${gridPosition.y}`);
    console.log(`debugCell: World position: ${worldPosition.x}, ${worldPosition.y}`);
  }

  private removeGlow() {
    if (this.glowOverlay) {
      this.removeChild(this.glowOverlay);
      this.glowOverlay = null;
    }
  }

  private glowCell(event: FederatedPointerEvent) {
    const localPoint = event.getLocalPosition(this);

    // Verifica se il mouse è all'interno dell'area della mappa
    if (localPoint.x >= 0 && localPoint.x < this.mapWidth &&
      localPoint.y >= 0 && localPoint.y < this.mapHeight) {

      const gridPosition = {
        x: Math.floor(localPoint.x / this.cellSize),
        y: Math.floor(localPoint.y / this.cellSize)
      };

      // Rimuovi il glow precedente se esiste
      this.removeGlow();

      // Crea un nuovo glow nella posizione corretta
      this.glowOverlay = new MapCell(
        gridPosition.x,
        gridPosition.y,
        this.cellSize,
        BiomeType.GLOW
      );
      this.addChild(this.glowOverlay);
    } else {
      // Se il mouse è fuori dalla mappa, rimuovi il glow
      this.removeGlow();
    }
  }

  public getGrid(): number[][] {
    return this.cells.map(row =>
      row.map(cell => (cell.isWalkable() ? 0 : 1))
    );
  }

  public worldToGrid(worldPos: { x: number; y: number }) {
    // Converte coordinate globali in coordinate locali rispetto alla mappa
    const local = this.toLocal(worldPos);

    const col = Math.floor(local.x / this.cellSize);
    const row = Math.floor(local.y / this.cellSize);

    return { x: col, y: row };
  }

  public gridToWorld(gridPos: { x: number; y: number }, anchor: "center" | "topleft" = "center") {
    const baseX = gridPos.x * this.cellSize;
    const baseY = gridPos.y * this.cellSize;

    let worldX: number;
    let worldY: number;

    if (anchor === "center") {
      worldX = baseX + this.cellSize / 2;
      worldY = baseY + this.cellSize / 2;
    } else {
      worldX = baseX;
      worldY = baseY;
    }

    const point = new Point(worldX, worldY);

    // Converte coordinate locali della mappa in globali
    const global = this.toGlobal(point);

    return { x: global.x, y: global.y };
  }
}
