class Game {

    constructor() {
        G = this;

        G.t = 0;

        new World();
        new Camera();

        // Initialize cursors
        G.cursor = G.selectionCursor = new SelectionCursor();
        G.attackCursor = new AttackCursor();
        G.reachCursor = new ReachCursor();

        // Add a proxy object that will call render on the current cursor
        W.add({
            'render': () => G.cursor.render(),
            'postRender': () => G.cursor.postRender()
        }, RENDERABLE);

        // Start cycle()
        let lf = Date.now();
        let frame = () => {
            let n = Date.now(),
                e = (n - lf) / 1000;

            if(DEBUG){
                G.fps = ~~(1 / e);
            }

            lf = n;

            G.cycle(e);

            requestAnimationFrame(frame);
        };
        frame();
    }

    cycle(e) {
        G.t += e;

        // Game loop things
        W.cyclables.forEach(x => x.cycle(e));
        V.cycle(e);

        G.updateCursor();

        // Render things
        W.render();

        G.minimap();

        drawCenteredText(R, nomangle('beacons'), CANVAS_WIDTH / 2, 10, HUD_SCORE_CELL_SIZE, '#fff', true);
        drawCenteredText(R, nomangle('units'), CANVAS_WIDTH / 2, 30, HUD_SCORE_CELL_SIZE, '#fff', true);

        function gauge(x, y, value, sign, color) {
            const w = (5 + value * 10) * sign;

            R.fillStyle = '#000';
            fillRect(x + 2, y + 2, w, HUD_SCORE_CELL_SIZE * 5);

            R.fillStyle = color;
            fillRect(x, y, w, HUD_SCORE_CELL_SIZE * 5);

            drawCenteredText(R, '' + value, x + w + sign * 15, y, HUD_SCORE_CELL_SIZE, color, true);
        }

        gauge((CANVAS_WIDTH - HUD_GAUGE_GAP) / 2, 10, G.beaconsScore(PLAYER_TEAM), -1, '#0f0');
        gauge((CANVAS_WIDTH + HUD_GAUGE_GAP) / 2, 10, G.beaconsScore(ENEMY_TEAM), 1, '#f00');

        gauge((CANVAS_WIDTH - HUD_GAUGE_GAP) / 2, 30, G.unitsScore(PLAYER_TEAM), -1, '#0f0');
        gauge((CANVAS_WIDTH + HUD_GAUGE_GAP) / 2, 30, G.unitsScore(ENEMY_TEAM), 1, '#f00');
    }

    beaconsScore(team) {
        return W.beacons.filter(b => b.team == team).length;
    }

    unitsScore(team) {
        return W.units.filter(b => b.team == team).length;
    }

    get minimapWidth() {
        return MINIMAP_SCALE * W.width;
    }

    get minimapHeight() {
        return MINIMAP_SCALE * W.height;
    }

    minimap() {
        // console.log()

        wrap(() => {
            translate(CANVAS_WIDTH - W.width * MINIMAP_SCALE, CANVAS_HEIGHT - W.height * MINIMAP_SCALE);

            R.globalAlpha = 0.5;
            R.fillStyle = '#444';
            R.strokeStyle = '#fff';
            R.lineWidth = 2;
            fillRect(0, 0, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));
            strokeRect(0, 0, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));

            R.fillStyle = '#fff';
            R.globalAlpha = 1;
            W.map.forEach((r, row) => {
                r.forEach((x, col) => {
                    if (x) {
                        R.fillRect(
                            round(row * GRID_SIZE * MINIMAP_SCALE),
                            round(col * GRID_SIZE * MINIMAP_SCALE),
                            round(MINIMAP_SCALE * GRID_SIZE),
                            round(MINIMAP_SCALE * GRID_SIZE)
                        );
                    }
                });
            });

            R.globalAlpha = 1;
            W.units
                .forEach(c => {
                    R.fillStyle = c.team.body;
                    R.fillRect(c.x * MINIMAP_SCALE - 2, c.y * MINIMAP_SCALE - 2, 5, 5);
                });

            R.lineWidth = 2;
            R.fillStyle = '#fff';
            R.strokeStyle = '#000';
            R.globalAlpha = 0.2;
            fillRect(
                ~~(V.x * MINIMAP_SCALE),
                ~~(V.y * MINIMAP_SCALE),
                ~~(CANVAS_WIDTH * MINIMAP_SCALE),
                ~~(CANVAS_HEIGHT * MINIMAP_SCALE)
            );
            strokeRect(
                ~~(V.x * MINIMAP_SCALE),
                ~~(V.y * MINIMAP_SCALE),
                ~~(CANVAS_WIDTH * MINIMAP_SCALE),
                ~~(CANVAS_HEIGHT * MINIMAP_SCALE)
            );
        });
    }

    updateCursor() {
        const p = {
            'x': MOUSE_POSITION.x + V.x,
            'y': MOUSE_POSITION.y + V.y
        };

        // Reset cursor
        const unit = W.units.filter(e => {
            return dist(p, e) < UNIT_RADIUS;
        }).sort((a, b) => dist(p, a) - dist(p, b))[0];

        let newCursor;

        if (G.cursor === G.selectionCursor && G.selectionCursor.downPosition || !G.selectionCursor.units.length) {
            newCursor = G.selectionCursor;
        } else if (unit && unit.team === ENEMY_TEAM) {
            newCursor = G.attackCursor;
            newCursor.track(unit);
        } else if (G.selectionCursor.units.length) {
            newCursor = G.reachCursor;
        } else {
            newCursor = G.selectionCursor;
        }

        G.cursor = newCursor;
        G.cursor.move(p);
    }

}
