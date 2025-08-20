import { Container } from "pixi.js";
import { GameMap } from "../map/GameMap";
import { GameUnit } from "../unit/GameUnit";


export class MovementManager extends Container {
  private gameMap: GameMap;
  private gameUnit: GameUnit;

  constructor(gameMap: GameMap, gameUnit: GameUnit) {
    super();
    this.gameMap = gameMap;
    this.gameUnit = gameUnit;
  }

  public moveUnitToCell(unit: GameUnit, cellX: number, cellY: number) {
    const targetX = cellX * this.gameMap.cellSize;
    const targetY = cellY * this.gameMap.cellSize;

    unit.x = targetX;
    unit.y = targetY;

    console.log(`Moved unit to position: ${targetX}, ${targetY}`);
  }
}