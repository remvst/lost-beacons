function copyMap(map) {
    return map.map(row => row.slice());
}

class World {

    constructor() {
        W = this;

        W.cyclables = [];
        W.renderables = [];

        for (let i = 0 ; i < 1 ; i++) {
            let unit = new Unit();
            unit.x = GRID_SIZE * (4.5 + i);
            unit.y = GRID_SIZE * 4.5;
            this.add(unit, CYCLABLE | RENDERABLE);
        }

        for (let i = 0 ; i < 5 ; i++) {
            let unit = new Unit();
            unit.x = GRID_SIZE * (4.5 + i);
            unit.y = GRID_SIZE * 6.5;
            unit.team = ENEMY_TEAM;
            this.add(unit, CYCLABLE | RENDERABLE);
        }

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
            return !W.polygons.filter(b => a !== b && a.isSame(b)).length;
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

        W.renderables.forEach(e => e.render());

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

    add(element, types) {
        if (types & CYCLABLE) {
            W.cyclables.push(element);
        }

        if (types & RENDERABLE) {
            W.renderables.push(element);
        }
    }

    remove(element) {
        W.cyclables.remove(element);
        W.renderables.remove(element);
    }

    isOut(x, y) {
        return x < 0 || x > W.width || y < 0 || y > W.height;
    }

    hasObstacle(x, y, radius = 0) {
        return [
            {'x': x - radius, 'y': y - radius},
            {'x': x - radius, 'y': y + radius},
            {'x': x + radius, 'y': y - radius},
            {'x': x + radius, 'y': y + radius}
        ].filter(pt => {
            return W.pointInObstacle(pt); // TODO don't really need the function here, leaving for clarity
        }).length;
    }

    pointInObstacle(pt) {
        return W.isOut(pt.x, pt.y) || W.map[~~(pt.y / GRID_SIZE)][~~(pt.x / GRID_SIZE)];
    }

    hasObstacleAtCell(cell) {
        return W.map[cell.row] && W.map[cell.row][cell.col];
    }

    /**
     * @param startPosition: Start position (x, y)
     * @param endPosition: End position (x, y)
     * @param endCondition: Function that should return true if the position is considered final
     */
    findPath(start, end, endCondition) {
        let solution = W.aStar({
            'row': ~~(start.y / GRID_SIZE),
            'col': ~~(start.x / GRID_SIZE)
        }, {
            'row': ~~(end.y / GRID_SIZE),
            'col': ~~(end.x / GRID_SIZE)
        }, cell => endCondition({
            'x': (cell.col + 0.5) * GRID_SIZE,
            'y': (cell.row + 0.5) * GRID_SIZE
        }));

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
     * @param endCondition: Function that should return true if the position is considered final
     */
    aStar(start, end, endCondition) {
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
            if (endCondition(expandedCell)) { // are we within shooting radius?
                return expandedCell; // TODO use raycasting instead
            }

            expandedMap[expandedCell.row][expandedCell.col] = 1;

            const top = {'row': expandedCell.row - 1, 'col': expandedCell.col};
            const bottom = {'row': expandedCell.row + 1, 'col': expandedCell.col};
            const left = {'row': expandedCell.row, 'col': expandedCell.col - 1};
            const right = {'row': expandedCell.row, 'col': expandedCell.col + 1};

            const obstacleTop = this.hasObstacleAtCell(top);
            const obstacleBottom = this.hasObstacleAtCell(bottom);
            const obstacleLeft = this.hasObstacleAtCell(left);
            const obstacleRight = this.hasObstacleAtCell(right);

            const neighbors = [top, bottom, left, right];

            if (!obstacleTop && !obstacleLeft) {
                neighbors.unshift({'row': top.row, 'col': left.col});
            }

            if (!obstacleTop && !obstacleRight) {
                neighbors.unshift({'row': top.row, 'col': right.col});
            }

            if (!obstacleBottom && !obstacleLeft) {
                neighbors.unshift({'row': bottom.row, 'col': left.col});
            }

            if (!obstacleBottom && !obstacleRight) {
                neighbors.unshift({'row': bottom.row, 'col': right.col});
            }

            // Not target, let's expanded from that cell!
            neighbors.forEach(x => {
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

    /**
     * Casts a ray and returns the collision or null
     * @param start The position at which the ray should be fired from
     * @param angle The angle at which the ray should be fired
     * @param maxDistance The maximum distance the ray should be cast to
     * @return The point at which the ray hit an obstacle, or null if none or too far
     */
    castRay(start, angle, maxDistance) {
        const castHorizontal = W.castAgainstHorizontal(start.x, start.y, angle);
        const castVertical = W.castAgainstVertical(start.x, start.y, angle);

        let cast;
        if (!castHorizontal) {
            cast = castVertical;
        } else if (!castVertical) {
            cast = castHorizontal;
        } else {
            const dHorizontal = dist(start, castHorizontal);
            const dVertical = dist(start, castVertical);
            cast = dHorizontal < dVertical ? castHorizontal : castVertical;
        }

        return maxDistance && (!cast || dist(start, cast)) > maxDistance
            ? {
                'x': start.x + Math.cos(angle) * maxDistance,
                'y': start.y + Math.sin(angle) * maxDistance
            }
            : cast;
    }

    castAgainstHorizontal(startX, startY, angle) {
        const pointingDown = Math.sin(angle) > 0;

        const y = ~~(startY / GRID_SIZE) * GRID_SIZE + (pointingDown ? GRID_SIZE : -0.0001);
        const x = startX + (y - startY) / Math.tan(angle);

        const yStep = pointingDown ? GRID_SIZE : -GRID_SIZE;
        const xStep = yStep / Math.tan(angle);

        return W.doCast(x, y, xStep, yStep);
    }

    castAgainstVertical(startX, startY, angle) {
        const pointingRight = Math.cos(angle) > 0;

        const x = ~~(startX / GRID_SIZE) * GRID_SIZE + (pointingRight ? GRID_SIZE : -0.0001);
        const y = startY + (x - startX) * Math.tan(angle);

        const xStep = pointingRight ? GRID_SIZE : -GRID_SIZE;
        const yStep = xStep * Math.tan(angle);

        return W.doCast(x, y, xStep, yStep);
    }

    doCast(startX, startY, xStep, yStep) {
        let x = startX,
            y = startY;

        for (var i = 0 ; i < 100 ; i++) {
            if (W.isOut(x, y)) {
                // Out of bounds
                return null;
            }

            if (W.hasObstacle(x, y)) {
                // Hit an obstacle!
                return { 'x': x, 'y': y };
            }

            x += xStep;
            y += yStep;
        }
    }

    positionsAround(position, radius, minDistance) {
        if (!radius) {
            return [position];
        }

        const perimeter = 2 * Math.PI * radius;
        const divisions = ~~(perimeter / minDistance);

        const positions = [];
        for (let i = 0 ; i < divisions ; i++) {
            const angle = (i / divisions) * 2 * Math.PI;
            positions.push({
                'x': position.x + Math.cos(angle) * radius,
                'y': position.y + Math.sin(angle) * radius
            });
        }

        return positions;
    }

    firstFreePositionsAround(position, forbidden, forbiddenRadius = GRID_SIZE) {
        for (let radius = 0 ; radius < GRID_SIZE * 10 ; radius += forbiddenRadius) {
            const positions = W.positionsAround(position, radius, forbiddenRadius)
                // Is this position even available?
                .filter(position => !W.hasObstacle(position.x, position.y, forbiddenRadius / 2))
                // Is this position in the forbidden list?
                .filter(position => {
                    return !forbidden.filter(forbiddenPosition => {
                        return dist(forbiddenPosition, position) < forbiddenRadius;
                    }).length;
                });

            if (positions.length) {
                return positions;
            }
        }

        return [];
    }

    hasObstacleBetween(a, b) {
        const d = dist(a, b);
        const cast = W.castRay(a, angleBetween(a, b), d);
        const castDist = dist(a, cast);
        // console.log(castDist, d);
        return dist(a, cast) < d;
    }

}
