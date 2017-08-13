class Game {

    constructor() {
        G = this;

        G.t = 0;

        new World();
        new Camera();

        G.selectedUnits = [];

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

        // Render things
        W.render();
    }

    select(s) {
        if (Math.abs(s.width || 0) < 5 && Math.abs(s.height || 0) < 5) {

            // Preventing selected units from going to a position that is already taken by another unit
            const usedPositions = W.cyclables.filter(e => {
                return e.team && G.selectedUnits.indexOf(e) < 0;
            });

            G.selectedUnits.forEach(unit => {
                let target;
                while (true) {
                    target = W.firstFreePositionsAround(s, usedPositions, UNIT_RADIUS)
                        .sort((a, b) => dist(a, unit) - dist(b, unit))[0];

                    if (target) {
                        usedPositions.push(target);
                        if (unit.goto(target)) {
                            break;
                        }

                    }
                }

                // Quick effect to show where we're going
                let circle;
                W.add(circle = {
                    'render': () => {
                        R.save();
                        R.translate(target.x, target.y);
                        R.scale(circle.a, circle.a);
                        R.globalAlpha = circle.a;
                        R.strokeStyle = '#0f0';
                        R.beginPath();
                        R.arc(0, 0, 5, 0, Math.PI * 2, true);
                        R.stroke();
                        R.restore(this.a);
                    }
                }, RENDERABLE);

                interp(circle, 'a', 1, 0, 0.3, 0, 0, () => W.remove(circle));
            });
            return;
        }

        G.selectedUnits = W.cyclables.filter(e => {
            return e.team === PLAYER_TEAM &&
                isBetween(s.x, e.x, s.x + s.width) &&
                isBetween(s.y, e.y, s.y + s.height);
        });
    }

}
