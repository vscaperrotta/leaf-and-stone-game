import { Container, Point } from "pixi.js";
import { GameMap } from "../game/map/GameMap";
import { findPathAStar, GridPos } from "../game/utils/astar";

type MoveState = {
  unit: Container;
  path: GridPos[];
  index: number;
  speedPxSec: number;
};

export class MovementManager {
  private states = new Map<Container, MoveState>();

  constructor(private map: GameMap, private defaultSpeed = 120) { }

  issueMoveToGrid(unit: Container, goal: GridPos, speedPxSec = this.defaultSpeed) {
    const startWorld = unit.getGlobalPosition(new Point());
    const startGrid = this.map.worldToGrid({ x: startWorld.x, y: startWorld.y });
    const grid = this.map.getGrid();
    const path = findPathAStar(grid, startGrid, goal);
    if (path.length === 0) return false;

    this.states.set(unit, { unit, path, index: 0, speedPxSec });
    return true;
  }

  issueMoveToWorld(unit: Container, world: { x: number; y: number }, speedPxSec = this.defaultSpeed) {
    console.log('Moving to world coordinates:', world);
    const goal = this.map.worldToGrid(world);
    console.log('Converted to grid coordinates:', goal);
    const result = this.issueMoveToGrid(unit, goal, speedPxSec);
    console.log('Path found:', result);
    return result;
  }

  cancel(unit: Container) { this.states.delete(unit); }

  update(dtSeconds: number) {
    for (const state of this.states.values()) {
      const waypointGrid = state.path[state.index];
      const targetWorld = this.map.gridToWorld(waypointGrid, "center");

      if (this.stepUnitTowards(state.unit, targetWorld, state.speedPxSec, dtSeconds)) {
        state.index++;
        if (state.index >= state.path.length) {
          this.states.delete(state.unit);
        }
      }
    }
  }

  private stepUnitTowards(unit: Container, targetWorld: { x: number; y: number }, speed: number, dt: number) {
    const curWorld = unit.getGlobalPosition(new Point());
    const dx = targetWorld.x - curWorld.x;
    const dy = targetWorld.y - curWorld.y;
    const dist = Math.hypot(dx, dy);
    const step = speed * dt;

    if (dist <= Math.max(1, step)) {
      const local = unit.parent!.toLocal(new Point(targetWorld.x, targetWorld.y));
      unit.position.set(local.x, local.y);
      return true;
    } else {
      const nx = dx / dist, ny = dy / dist;
      const nextWorld = new Point(curWorld.x + nx * step, curWorld.y + ny * step);
      const nextLocal = unit.parent!.toLocal(nextWorld);
      unit.position.set(nextLocal.x, nextLocal.y);
      return false;
    }
  }
}
