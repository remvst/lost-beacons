class ReachCursor extends Cursor {

    get color() {
        return '#0f0';
    }

    postRender() {
        const s = (G.t % REACH_CURSOR_PERIOD) / REACH_CURSOR_PERIOD;

        translate(this.x, this.y);

        this.renderLabel(nomangle('REACH()'));

        R.fillStyle = this.color;
        R.globalAlpha = 1 - s;

        beginPath();
        arc(0, 0, s * REACH_CURSOR_RADIUS, 0, PI * 2, true);
        fill();
    }

    track(target) {
        this.x = target.x;
        this.y = target.y;
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

}
