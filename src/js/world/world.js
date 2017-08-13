function copyMap(map) {
    return map.map(row => row.slice());
}

class World {

    constructor() {
        W = this;

        W.elements = [];

        let unit1 = new Unit();
        unit1.x = GRID_SIZE * 4.5;
        unit1.y = GRID_SIZE * 4.5;
        this.add(unit1);

        W.map = generate();
        W.polygons = [];

        // TODO maybe use reduce?
        W.map.forEach((r, row) => {
            r.forEach((e, col) => {
                if (e) {
                    W.polygons = W.polygons.concat(cube(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE, '#158'));
                }
            });
        });

        // Filter out polygons that are pretty much the same
        W.polygons = W.polygons.filter(a => {
            return !W.polygons.filter(b => a !== b && a.isSame(b)).length
        });
    }

    render() {
        R.fillStyle = '#0e3b54';
        R.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        R.save();
        R.translate(-V.x, -V.y);

        R.fillStyle = GRID_COLOR;
        for (let x = round(V.x, GRID_SIZE) ; x < V.x + CANVAS_WIDTH ; x += GRID_SIZE) {
            R.fillRect(x, V.y, 1, CANVAS_HEIGHT);
        }
        for (let y = round(V.y, GRID_SIZE) ; y < V.y + CANVAS_HEIGHT ; y += GRID_SIZE) {
            R.fillRect(V.x, y, CANVAS_WIDTH, 1);
        }

        W.elements.forEach(e => e.render());

        W.polygons.filter(function(p) {
            if (Math.abs(p.center.x - V.center.x) > CANVAS_WIDTH / 2 + GRID_SIZE / 2 ||
                Math.abs(p.center.y - V.center.y) > CANVAS_HEIGHT / 2 + GRID_SIZE / 2) {
                return false;
            }
            return p.renderCondition(V.center);
        }).sort((a, b) => {
            return dist(b.center, V.center) - dist(a.center, V.center);
        }).forEach(p => p.render());

        if (G.selection) {
            R.strokeStyle = 'white';
            R.fillStyle = 'rgba(0,0,0,0.1)';
            R.lineWidth = 1;
            R.fillRect(G.selection.x, G.selection.y, G.selection.width, G.selection.height);
            R.strokeRect(G.selection.x, G.selection.y, G.selection.width, G.selection.height);
        }

        R.restore();
    }

    get width() {
        return W.map[0].length * GRID_SIZE;
    }

    get height() {
        return W.map.length * GRID_SIZE;
    }

    add(element) {
        W.elements.push(element);
    }

    remove() {
        W.elements.remove(element);
    }

    isOut(x, y) {
        return x < 0 || x > this.width || y < 0 || y > this.height;
    }

    hasObstacle(x, y){
        const row = ~~(y / GRID_SIZE);
        const col = ~~(x / GRID_SIZE);
        return W.map[row] && W.map[row][col];
    }

    /**
     * @param startPosition: Start position (x, y)
     * @param endPosition: End position (x, y)
     */
    findPath(start, end) {
        let solution = W.aStar({
            'row': ~~(start.y / GRID_SIZE),
            'col': ~~(start.x / GRID_SIZE)
        }, {
            'row': ~~(end.y / GRID_SIZE),
            'col': ~~(end.x / GRID_SIZE)
        });

        if (solution) {
            const path = [];
            while (solution) {
                path.unshift({
                    'x': (solution.col + 0.5) * GRID_SIZE,
                    'y': (solution.row + 0.5) * GRID_SIZE
                });
                solution = solution.parent;
            }

            return path;
        }
    }

    /**
     * @param start: Start position (row, col)
     * @param end: End position (row, col)
     */
    aStar(start, end) {
        const map = W.map;

        const expandable = [start];
        const expandedMap = copyMap(map);

        start.distance = 0;

        while (expandable.length) {
            // Picking the cell that is the closest to the target and has the least distance from the start
            let expandIndex,
                expandDist = Number.MAX_VALUE;
            expandable.forEach((x, i) => {
                const dist = x.distance + distP(x.row, x.col, end.row, end.col);
                if (dist < expandDist) {
                    expandDist = dist;
                    expandIndex = i;
                }
            });

            let expandedCell = expandable[expandIndex];
            expandable.splice(expandIndex, 1);

            // Check if destination
            if (distP(expandedCell.row, expandedCell.col, end.row, end.col) < 3) { // are we within shooting radius?
                return expandedCell; // TODO use raycasting instead
            }

            expandedMap[expandedCell.row][expandedCell.col] = 1;

            // Not target, let's expanded from that cell!
            [
                {'row': expandedCell.row + 1, 'col': expandedCell.col + 1},
                {'row': expandedCell.row + 1, 'col': expandedCell.col - 1},
                {'row': expandedCell.row - 1, 'col': expandedCell.col + 1},
                {'row': expandedCell.row + 1, 'col': expandedCell.col - 1},
                {'row': expandedCell.row + 1, 'col': expandedCell.col},
                {'row': expandedCell.row - 1, 'col': expandedCell.col},
                {'row': expandedCell.row, 'col': expandedCell.col + 1},
                {'row': expandedCell.row, 'col': expandedCell.col - 1}
            ].forEach(x => {
                if (
                    x.row < 0 ||
                    x.col < 0 ||
                    x.row >= map.length ||
                    x.col >= map[0].length ||
                    expandedMap[x.row][x.col]
                ) {
                    return;
                }

                x.parent = expandedCell;
                x.distance = expandedCell.distance + distP(x.row, x.col, expandedCell.row, expandedCell.col);

                const existing = expandedMap[x.row][x.col];
                if (isNaN(existing)) {
                    if (existing.distance > x.distance) {
                        existing.distance = x.distance;
                        existing.parent = x.parent;
                        // In a perfect world we would also update its children since we found a shorter path but fuck it this seems to work
                    }

                    return;
                }

                expandedMap[x.row][x.col] = expandedCell;
                expandable.push(x);
            });
        }
    }

}
