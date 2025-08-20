import { GameMap } from "../game/map/GameMap";
import { GameUnit } from "../game/unit/GameUnit";
import { UnitCell } from "../game/unit/UnitCell";

export class MovementTracker {
  private gameMap: GameMap;
  private gameUnit: GameUnit;

  constructor(map: GameMap, unit: GameUnit) {
    this.gameMap = map;
    this.gameUnit = unit;
  }

  public setupEventListeners() {
    this.gameUnit.on('selectionChanged', (unit: UnitCell | null) => {
      this.gameMap.setSelectedUnit(unit);
    });
  }
}
