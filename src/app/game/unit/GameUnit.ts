import { Container, FederatedPointerEvent } from "pixi.js";
import { UnitType } from "./UnitType";
import { UnitCell } from "./UnitCell";

export class GameUnit extends Container {
  private units: UnitCell[] = [];
  private selectedUnit: UnitCell | null = null;
  private cellSize: number;

  constructor(x: number, y: number, cellSize: number, quantity: number) {
    super();

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

    console.log('Generating units with spacing:', spacing);
    console.log('Cell size:', this.cellSize);
    console.log('Quantity:', quantity);

    for (let i = 0; i < quantity; i++) {
      const unit = new UnitCell(0, 0, this.cellSize * 0.4, UnitType.CITIZEN);

      console.log('unit', unit);

      // Distribuisci le unità uniformemente all'interno della cella
      unit.x = spacing * (i + 1) - unit.width / 2;
      unit.y = (this.cellSize - unit.height) / 2;

      this.units.push(unit);
      this.addChild(unit);
    }
  }

  private setupEventListeners() {
    this.on('click', this.onUnitClick, this);
    this.on('rightclick', this.onUnitRightClick, this);
  }

  private onUnitRightClick(event: FederatedPointerEvent) {
    console.log("UnitCell: Right click detected");
    // Se non c'è un'unità selezionata, non fare nulla
    if (!this.selectedUnit) return;

    // Ottieni le coordinate globali del click
    const globalPoint = event.global;

    // Converti le coordinate globali in coordinate della griglia
    const gridX = Math.floor(globalPoint.x / this.cellSize);
    const gridY = Math.floor(globalPoint.y / this.cellSize);

    console.log(`Moving unit to grid position: ${gridX}, ${gridY}`);

    // Muovi l'unità selezionata nella nuova posizione
    this.moveTo(gridX, gridY);
  }

  private onUnitClick(event: FederatedPointerEvent) {
    // Trova l'unità cliccata
    const clickedUnit = this.units.find(unit => {
      const globalPoint = event.global;
      const localPoint = unit.toLocal(globalPoint);
      // Verifica se il punto è all'interno del cerchio dell'unità
      const radius = (this.cellSize * 0.4) / 2; // Il raggio è la metà della dimensione dell'unità
      const centerX = unit.width / 2;
      const centerY = unit.height / 2;

      // Calcola la distanza dal centro usando il teorema di Pitagora
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
        // Altrimenti, deseleziona l'unità precedentemente selezionata (se presente)
        // e seleziona la nuova unità
        if (this.selectedUnit) {
          this.selectedUnit.deselect();
        }
        this.selectedUnit = clickedUnit;
        clickedUnit.select();
      }
    }
  }

  public getSelectedUnit(): UnitCell | null {
    return this.selectedUnit;
  }

  public clearSelection() {
    if (this.selectedUnit) {
      this.selectedUnit.deselect();
      this.selectedUnit = null;
    }
  }

  public moveTo(x: number, y: number) {
    // Calcola la nuova posizione
    const targetX = x * this.cellSize;
    const targetY = y * this.cellSize;

    // Aggiorna la posizione dell'unità selezionata
    if (this.selectedUnit) {
      this.selectedUnit.x = targetX - this.x;  // Posizione relativa al container
      this.selectedUnit.y = targetY - this.y;
    }
  }
}
