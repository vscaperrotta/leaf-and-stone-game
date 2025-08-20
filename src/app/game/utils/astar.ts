// PathfinderAStar.ts
export type GridPos = { x: number; y: number };

type Node = GridPos & { g: number; h: number; f: number; parent?: Node };

const hManhattan = (a: GridPos, b: GridPos) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export function findPathAStar(grid: number[][], start: GridPos, goal: GridPos): GridPos[] {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;
  const isBlocked = (x: number, y: number) => grid[y][x] === 1;

  if (!inBounds(start.x, start.y) || !inBounds(goal.x, goal.y)) return [];
  if (isBlocked(goal.x, goal.y)) return [];

  const open: Node[] = [{ ...start, g: 0, h: hManhattan(start, goal), f: hManhattan(start, goal) }];
  const closed = new Set<string>();
  const key = (x: number, y: number) => `${x},${y}`;

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    if (current.x === goal.x && current.y === goal.y) {
      const path: GridPos[] = [];
      let n: Node | undefined = current;
      while (n) { path.push({ x: n.x, y: n.y }); n = n.parent; }
      return path.reverse();
    }
    closed.add(key(current.x, current.y));

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const n of neighbors) {
      if (!inBounds(n.x, n.y) || isBlocked(n.x, n.y) || closed.has(key(n.x, n.y))) continue;

      const g = current.g + 1;
      const h = hManhattan(n, goal);
      const f = g + h;

      const existing = open.find(o => o.x === n.x && o.y === n.y);
      if (existing && existing.g <= g) continue;

      open.push({ ...n, g, h, f, parent: current });
    }
  }
  return [];
}
