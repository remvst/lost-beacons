class Game {

    constructor() {
        G = this;

        G.t = 0;

        new World();
        new Camera();

        G.selectedUnits = [];

        W.add(G.cursorRenderable = {
            'render': () => 0
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

        // Render things
        W.render();
    }

    select(s) {
        if (Math.abs(s.width || 0) < 5 && Math.abs(s.height || 0) < 5) {

            G.selectedUnits.filter(unit => !unit.dead).forEach(unit => {
                unit.goto(s);

                // Quick effect to show where we're going
                let circle;
                let target = unit.behavior.reservedPosition();
                W.add(circle = {
                    'render': () => {
                        R.save();
                        R.translate(target.x, target.y);
                        R.scale(circle.a, circle.a);
                        R.globalAlpha = circle.a;
                        R.strokeStyle = '#0f0';
                        R.lineWidth = 1;
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

    mouseOver(p) {
        // Reset cursor

        const unit = W.cyclables.filter(e => {
            return e.team &&
                dist(p, e) < UNIT_RADIUS;
        }).sort((a, b) => dist(p, a) - dist(p, b))[0];

        if (unit) {
            if (unit != G.cursorRenderable.unit) {
                G.cursorRenderable.scale = 0;
                G.cursorRenderable.render = () => {
                    R.globalAlpha = 0.1;
                    R.fillStyle = unit.team.body;
                    R.strokeStyle = unit.team.body;
                    R.lineWidth = 10;
                    beginPath();
                    arc(unit.x, unit.y, G.cursorRenderable.scale * UNIT_ATTACK_RADIUS, 0, Math.PI * 2, true);
                    fill();
                    // stroke();
                    R.globalAlpha = 1;
                };

                interp(G.cursorRenderable, 'scale', 0, 1, 0.2);
            }
        } else if (!unit) {
            G.cursorRenderable.render = () => 0;
        }

        G.cursorRenderable.unit = unit;
    }

}
