import { Graphics } from "pixi.js";
import { UnitType } from "./UnitType";

export class UnitCell extends Graphics {
  private readonly unitType: UnitType;
  private readonly unitSize: number;
  private isSelected = false;

  constructor(x: number, y: number, size: number, unitType: UnitType) {
    super();

    this.unitType = unitType;
    this.unitSize = size;

    // Posiziona la cella
    this.x = x * size;
    this.y = y * size;

    // Rendi l'unità interattiva
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.draw();
  }

  private draw() {
    this.clear();

    this.circle(this.unitSize / 2, this.unitSize / 2, this.unitSize / 2);
    this.fill(this.getUnitColor(this.unitType));

    // Se è selezionata, disegna un cerchio più grande per il bordo di selezione
    if (this.isSelected) {
      this.stroke({
        width: 2,
        color: 0x333333
      });
    }
  }

  private getUnitColor(unitType: UnitType): number {
    switch (unitType) {
      case UnitType.CITIZEN:
        return 0xFFA500; // Arancione per i cittadini
      default:
        return 0x808080; // Grigio come fallback
    }
  }

  public select() {
    this.isSelected = true;
    this.draw();
  }

  public deselect() {
    this.isSelected = false;
    this.draw();
  }

  public getUnitType(): UnitType {
    return this.unitType;
  }
}
