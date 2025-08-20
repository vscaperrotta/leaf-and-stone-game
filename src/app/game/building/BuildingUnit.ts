import { Container } from "pixi.js";
import { BuildingType } from "./BuildingType";
import { BuildingCell } from "./BuildingCell";

export class BuildingUnit extends Container {
  private units: BuildingCell[] = [];
  private cellSize: number;
  public selectedUnit: BuildingCell | null = null;
  public quantity: number;

  constructor(cellSize: number, quantity: number) {
    super();

    const x = 0;
    const y = 0;

    this.cellSize = cellSize;
    this.x = x * cellSize;
    this.y = y * cellSize;
    this.quantity = quantity;

    // Rendi il container interattivo per catturare gli eventi
    this.eventMode = 'static';
  }

  public generateBuildHall() {
    const hall = new BuildingCell(0, 0, this.cellSize, BuildingType.HALL);
    hall.x = this.cellSize / 2 - hall.width / 2;
    hall.y = this.cellSize / 2 - hall.height / 2;
    this.units.push(hall);
    this.addChild(hall);
  }

}
