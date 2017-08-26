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

        // Add a proxy object that will call render on the current cursor
        W.add({
            'render': () => G.cursor.render(),
            'postRender': () => G.cursor.postRender()
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
