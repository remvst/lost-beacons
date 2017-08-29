class HealCursor extends Cursor {

    get color() {
        return '#0f0';
    }

    postRender() {
        const s = 1 - (G.t % HEAL_CURSOR_PERIOD) / HEAL_CURSOR_PERIOD;

        translate(this.target.x, this.target.y);

        const corner = a => () => {
            translate(cos(a) * HEAL_CURSOR_RADIUS, sin(a) * HEAL_CURSOR_RADIUS);
            rotate(a);

            beginPath();
            moveTo(-HEAL_CURSOR_SIZE, 0);
            lineTo(0, HEAL_CURSOR_SIZE);
            lineTo(0, -HEAL_CURSOR_SIZE);
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

        this.renderLabel(nomangle('HEAL()'));
    }

    track(target) {
        this.target = target;
        this.x = target.x;
        this.y = target.y;
    }

    rightDown() {
        if (this.target) {
            G.selectionCursor.units.forEach(unit => {
                unit.setBehavior(new Chase(this.target, UNIT_HEAL_RADIUS));
            });
        }
    }

}
