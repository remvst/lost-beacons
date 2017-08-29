class ChaseCursor extends Cursor {

    get color() {
        return '#0f0';
    }

    postRender() {
        const s = 1 - (G.t % this.period) / this.period;

        translate(this.target.x, this.target.y);

        const corner = a => () => {
            translate(cos(a) * CHASE_CURSOR_RADIUS, sin(a) * CHASE_CURSOR_RADIUS);
            rotate(a);

            beginPath();
            moveTo(-CHASE_CURSOR_SIZE, 0);
            lineTo(0, CHASE_CURSOR_SIZE);
            lineTo(0, -CHASE_CURSOR_SIZE);
            fill();
        };

        R.fillStyle = this.color;

        wrap(() => {
            R.globalAlpha = s;
            scale(s, s);
            let i = 4;
            while (i--) {
                wrap(corner((i / 4) * PI * 2 + PI / 4));
            }
        });

        this.renderLabel(this.label);
    }

    track(target) {
        this.target = target;
        this.x = target.x;
        this.y = target.y;
    }

    rightDown() {
        if (this.target) {
            G.selectionCursor.units.forEach(unit => {
                unit.setBehavior(new Chase(this.target, this.chaseRadius));
            });
        }
    }

}
