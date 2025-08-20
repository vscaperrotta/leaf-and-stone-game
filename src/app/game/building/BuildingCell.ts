import { Graphics } from "pixi.js";
import { BuildingType } from "./BuildingType";

export class BuildingCell extends Graphics {
  private readonly buildingType: BuildingType;
  private readonly buildingSize: number;

  constructor(x: number, y: number, size: number, buildingType: BuildingType) {
    super();

    this.buildingType = buildingType;
    this.buildingSize = size;

    // Posiziona la cella
    this.x = x * size;
    this.y = y * size;

    this.draw();
  }

  private draw() {
    this.clear();
    this.rect(0, 0, this.buildingSize, this.buildingSize);
    this.fill(this.getBuildingColor(this.buildingType));
  }

  private getBuildingColor(buildingType: BuildingType): number {
    switch (buildingType) {
      case BuildingType.HALL:
        return 0x7d553e;
      case BuildingType.HOUSE:
        return 0xd1ad64;
      case BuildingType.STORAGE:
        return 0xa19d9a;
      default:
        return 0x808080; // Fallback
    }
  }

  public getBuildingType(): BuildingType {
    return this.buildingType;
  }
}
