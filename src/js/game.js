class Game {

    constructor() {
        G = this;

        G.t = 0;

        G.launch(MenuWorld);

        G.gridPattern = cache(1, 4, (r, c) => {
            r.fillStyle = 'rgba(0,0,0,.2)';
            r.fillRect(0, 0, 1, 1);
            return r.createPattern(c, 'repeat');
        });

        G.hudGradient = R.createLinearGradient(0, 0, 0, HUD_HEIGHT);
        G.hudGradient.addColorStop(0, 'rgba(0,0,0,0)');
        G.hudGradient.addColorStop(1, 'rgba(0,0,0,0.5)');

        G.hudBg = R.createLinearGradient(0, 0, 0, HUD_HEIGHT);
        G.hudBg.addColorStop(0, '#035');
        G.hudBg.addColorStop(1, '#146');

        G.floorPattern = cache(GRID_SIZE * 5, GRID_SIZE * 5, (r, c) => {
            r.fillStyle = '#0e3b54';
            r.fillRect(0, 0, c.width, c.height);

            r.globalAlpha = 0.05;
            r.fillStyle = '#fff';
            for (let x = 0 ; x < c.width ; x += GRID_SIZE / 2) {
                r.fillRect(0, x, c.width, 1);
                r.fillRect(x, 0, 1, c.height);
            }

            r.globalAlpha = 0.5;
            r.fillStyle = GRID_COLOR;
            r.shadowColor = 'rgba(255,255,255, 0.2)';
            r.shadowBlur = 3;
            for (let x = 0 ; x < c.width ; x += GRID_SIZE) {
                r.fillRect(0, x, c.width, 1);
                r.fillRect(x, 0, 1, c.height);
            }

            r.shadowBlur = 0;

            r.globalAlpha = 0.5;
            r.fillStyle = '#fff';
            r.fillRect(GRID_SIZE, GRID_SIZE - 7, 1, 14);
            r.fillRect(GRID_SIZE - 7, GRID_SIZE, 14, 1);

            r.globalAlpha = 0.02;
            r.fillRect(GRID_SIZE * 3, GRID_SIZE * 4, GRID_SIZE, GRID_SIZE);
            r.fillRect(GRID_SIZE * 4, GRID_SIZE * 2, GRID_SIZE, GRID_SIZE);
            r.fillRect(GRID_SIZE * 1, GRID_SIZE * 3, GRID_SIZE, GRID_SIZE);

            return r.createPattern(c, 'repeat');
        });

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

    launch(worldType) {
        new Camera();
        new worldType();

        // Initialize cursors
        G.cursor = G.selectionCursor = new SelectionCursor();
        G.attackCursor = new AttackCursor();
        G.reachCursor = new ReachCursor();
        G.healCursor = new HealCursor();

        // Add a proxy object that will call render on the current cursor
        W.add({
            // No cursor implements render()
            // 'render': () => G.cursor.render(),

            // Not post rendering the cursor if hovering a reinforcements button
            'postRender': () => C.style[nomangle('cursor')] == 'default' && G.cursor.postRender()
        }, RENDERABLE);
    }

    cycle(e) {
        G.t += e;

        // Game loop things
        W.cycle(e);
        G.updateCursor();

        // Render things
        W.render();
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
        } else if (unit && (G.selectionCursor.units.length > 1 || G.selectionCursor.units[0] != unit)) {
            newCursor = unit.team === ENEMY_TEAM ? G.attackCursor : G.healCursor;
            newCursor.track(unit);
        } else if (G.selectionCursor.units.length) {
            newCursor = G.reachCursor;
        } else {
            newCursor = G.selectionCursor;
        }

        G.cursor = newCursor;
        G.cursor.move(p);

        C.style[nomangle('cursor')] = W.beacons.filter(beacon => beacon.inReinforcementsButton(G.cursor)).length ? 'pointer' : 'default';
    }

}
