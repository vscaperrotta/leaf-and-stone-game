import { Container, FederatedPointerEvent } from "pixi.js";
import { UnitType } from "./UnitType";
import { UnitCell } from "./UnitCell";

export class GameUnit extends Container {
  private units: UnitCell[] = [];
  private cellSize: number;
  public selectedUnit: UnitCell | null = null;

  constructor(cellSize: number, quantity: number) {
    super();

    const x = 0;
    const y = 0;

    this.cellSize = cellSize;
    this.x = x * cellSize;
    this.y = y * cellSize;

    // Rendi il container interattivo per catturare gli eventi
    this.eventMode = 'static';

    this.generateUnits(quantity);
    this.setupEventListeners();
  }

  private generateUnits(quantity: number) {
    // const spacing = this.cellSize / (quantity + 1);
    const spacing = this.cellSize;

    for (let i = 0; i < quantity; i++) {
      const unit = new UnitCell(0, 0, this.cellSize * 0.4, UnitType.CITIZEN);

      // Distribuisci le unità uniformemente all'interno della cella
      unit.x = spacing * (i + 1) - unit.width / 2;
      unit.y = (this.cellSize - unit.height) / 2;

      this.units.push(unit);
      this.addChild(unit);
    }
  }

  private setupEventListeners() {
    this.on('click', this.onUnitClick, this);
  }

  private onUnitClick(event: FederatedPointerEvent) {
    // Trova l'unità cliccata
    const clickedUnit = this.units.find(unit => {
      const globalPoint = event.global;
      const localPoint = unit.toLocal(globalPoint);
      const radius = (this.cellSize * 0.4) / 2;
      const centerX = unit.width / 2;
      const centerY = unit.height / 2;

      const dx = localPoint.x - centerX;
      const dy = localPoint.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance <= radius;
    });

    if (clickedUnit) {
      // Se l'unità cliccata è già selezionata, deselezionala
      if (this.selectedUnit === clickedUnit) {
        clickedUnit.deselect();
        this.selectedUnit = null;
      } else {
        // Deseleziona l'unità precedentemente selezionata (se presente) e seleziona la nuova unità
        if (this.selectedUnit) {
          this.selectedUnit.deselect();
        }
        this.selectedUnit = clickedUnit;
        clickedUnit.select();
      }

      this.emit('selectionChanged', this.selectedUnit);
    }
  }
}
