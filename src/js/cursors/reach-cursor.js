class ReachCursor extends Cursor {

    get color() {
        return '#0f0';
    }

    postRender() {
        const s = (G.t % REACH_CURSOR_PERIOD) / REACH_CURSOR_PERIOD;

        translate(this.currentPosition.x, this.currentPosition.y);

        const cursorScale = min(1, max(0, (G.t - this.timeOnPosition - 0.1) * 10));
        scale(cursorScale, cursorScale);

        this.renderLabel(nomangle('REACH()'));

        R.fillStyle = this.color;
        R.globalAlpha = 1 - s;

        beginPath();
        arc(0, 0, s * REACH_CURSOR_RADIUS, 0, PI * 2, true);
        fill();
    }

    move(p) {
        if (!this.currentPosition || p.x != this.currentPosition.x || p.y != this.currentPosition.y) {
            this.timeOnPosition = G.t;
        }

        super.move(p);
    }

    up() {
        super.up();

        G.selectionCursor.units.forEach(unit => {
            unit.goto(this.currentPosition);

            // Quick effect to show where we're going
            let circle;
            let target = unit.behavior.reservedPosition();
            W.add(circle = {
                'render': () => {
                    R.translate(target.x, target.y);
                    R.scale(circle.a, circle.a);
                    R.globalAlpha = circle.a;
                    R.strokeStyle = '#0f0';
                    R.lineWidth = 1;
                    R.beginPath();
                    R.arc(0, 0, 5, 0, PI * 2, true);
                    R.stroke();
                }
            }, RENDERABLE);

            interp(circle, 'a', 1, 0, 0.3, 0, 0, () => W.remove(circle));
        });
    }

    cycle(e) {
        this.timeOnPosition += e;
        console.log(this.timeOnPosition);
        super.cycle(e);
    }

}
