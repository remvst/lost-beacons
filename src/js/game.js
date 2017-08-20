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

        G.gridPattern = cache(1, 4, (r, c) => {
            r.fillStyle = 'rgba(0,0,0,.2)';
            r.fillRect(0, 0, 1, 1);
            return r.createPattern(c, 'repeat');
        });

        G.hudGradient = R.createLinearGradient(0, 0, 0, HUD_HEIGHT);
        G.hudGradient.addColorStop(0, 'rgba(0,0,0,0)');
        G.hudGradient.addColorStop(1, 'rgba(0,0,0,0.5)');

        G.hudBg = R.createLinearGradient(0, 0, 0, HUD_HEIGHT);
        G.hudBg.addColorStop(0, '#0e3956');
        G.hudBg.addColorStop(1, '#146');

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

        R.fillStyle = 'rgba(255,255,255,.15)';
        fillRect(0, ~~(G.t * 100) % CANVAS_HEIGHT * 1.5, CANVAS_WIDTH, 0.5);

        R.fillStyle = 'rgba(255,255,255,.02)';
        fillRect(0, ~~(G.t * 50) % CANVAS_HEIGHT * 1.5, CANVAS_WIDTH, 100);

        wrap(() => {
            translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT - HUD_HEIGHT);

            R.fillStyle = G.hudGradient;
            fillRect(-CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, HUD_HEIGHT);

            R.fillStyle = G.hudBg;
            R.strokeStyle = '#000';
            beginPath();
            moveTo(-220, HUD_HEIGHT);
            lineTo(-170, 0.5);
            lineTo(170, 0.5);
            lineTo(220, HUD_HEIGHT);
            fill();
            stroke();

            drawCenteredText(R, nomangle('beacons'), 0, 20, HUD_SCORE_CELL_SIZE, '#fff', true);
            drawCenteredText(R, nomangle('units'), 0, 40, HUD_SCORE_CELL_SIZE, '#fff', true);

            gauge(-HUD_GAUGE_GAP / 2, 20, G.beaconsScore(PLAYER_TEAM), -1, '#0f0');
            gauge(HUD_GAUGE_GAP / 2, 20, G.beaconsScore(ENEMY_TEAM), 1, '#f00');

            gauge(-HUD_GAUGE_GAP / 2, 40, G.unitsScore(PLAYER_TEAM), -1, '#0f0');
            gauge(HUD_GAUGE_GAP / 2, 40, G.unitsScore(ENEMY_TEAM), 1, '#f00');
        });

        R.fillStyle = G.gridPattern;
        fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        function gauge(x, y, value, sign, color) {
            const w = (5 + value * 10) * sign;

            R.fillStyle = '#000';
            fillRect(x + 2, y + 2, w, HUD_SCORE_CELL_SIZE * 5);

            R.fillStyle = color;
            fillRect(x, y, w, HUD_SCORE_CELL_SIZE * 5);

            drawCenteredText(R, '' + value, x + w + sign * 15, y, HUD_SCORE_CELL_SIZE, color, true);
        }

        G.minimap();
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
            translate(CANVAS_WIDTH - W.width * MINIMAP_SCALE - MINIMAP_MARGIN, CANVAS_HEIGHT - W.height * MINIMAP_SCALE - MINIMAP_MARGIN);

            R.globalAlpha = 0.5;
            R.strokeStyle = '#fff';
            R.lineWidth = 2;

            R.fillStyle = '#000';
            fillRect(4, 4, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));

            R.fillStyle = '#444';
            fillRect(0, 0, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));

            R.fillStyle = '#6cf';
            R.globalAlpha = 1;
            W.map.forEach((r, row) => {
                r.forEach((x, col) => {
                    if (x) {
                        fillRect(
                            round(row * GRID_SIZE * MINIMAP_SCALE),
                            round(col * GRID_SIZE * MINIMAP_SCALE),
                            round(MINIMAP_SCALE * GRID_SIZE),
                            round(MINIMAP_SCALE * GRID_SIZE)
                        );
                    }
                });
            });

            R.lineWidth = 1;
            R.fillStyle = '#fff';
            R.strokeStyle = '#000';
            R.globalAlpha = 0.2;
            fillRect(
                ~~(V.x * MINIMAP_SCALE),
                ~~(V.y * MINIMAP_SCALE),
                ~~(CANVAS_WIDTH * MINIMAP_SCALE),
                ~~(CANVAS_HEIGHT * MINIMAP_SCALE)
            );

            R.globalAlpha = 1;
            strokeRect(
                ~~(V.x * MINIMAP_SCALE) + 0.5,
                ~~(V.y * MINIMAP_SCALE) + 0.5,
                ~~(CANVAS_WIDTH * MINIMAP_SCALE),
                ~~(CANVAS_HEIGHT * MINIMAP_SCALE)
            );

            R.globalAlpha = 1;
            W.units
                .forEach(c => {
                    R.fillStyle = c.team.body;
                    fillRect(c.x * MINIMAP_SCALE - 1, c.y * MINIMAP_SCALE - 1, 2, 2);
                });

            W.beacons
                .forEach(beacon => {
                    R.fillStyle = beacon.team.beacon;
                    wrap(() => {
                        translate(beacon.x * MINIMAP_SCALE, beacon.y * MINIMAP_SCALE);
                        squareFocus(8, 4);
                    });
                });

            R.lineWidth = 1;
            R.strokeStyle = '#000';
            strokeRect(0.5, 0.5, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));
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
