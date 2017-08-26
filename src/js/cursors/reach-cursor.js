class ReachCursor extends Cursor {

    get color() {
        return '#0f0';
    }

    postRender() {
        const arrowRadius = 10;

        function arrow(x, y, alpha) {
            wrap(() => {
                R.globalAlpha = alpha;
                translate(x, y);
                beginPath();
                moveTo(0, 0);
                lineTo(arrowRadius, -arrowRadius);
                lineTo(-arrowRadius, -arrowRadius);
                fill();
            });
        }

        const beacon = W.beacons
            .filter(beacon => dist(beacon, this) < BEACON_CONQUER_RADIUS || W instanceof MenuWorld)[0];

        if (beacon) {
            const offset = (G.t * 1 % 1) * arrowRadius;

            R.fillStyle = PLAYER_TEAM.beacon;

            arrow(beacon.x, offset + beacon.y - 50, 1 - offset / arrowRadius);
            arrow(beacon.x, offset + beacon.y - arrowRadius - 50, 1);
            arrow(beacon.x, offset + beacon.y - arrowRadius * 2 - 50, offset / arrowRadius);
        }

        translate(this.x, this.y);

        const s = (G.t % REACH_CURSOR_PERIOD) / REACH_CURSOR_PERIOD;

        R.fillStyle = this.color;
        R.globalAlpha = 1 - s;
        squareFocus(20, 4);

        R.globalAlpha = 1;
        const cursorScale = min(1, max(0, (G.t - this.timeOnPosition - 0.5) * 10));
        scale(cursorScale, cursorScale);
        this.renderLabel(beacon ? (beacon.team == PLAYER_TEAM ? nomangle('DEFEND()') : nomangle('CAPTURE()')) : nomangle('REACH()'));
    }

    move(p) {
        if (!this || p.x != this.x || p.y != this.y) {
            this.timeOnPosition = G.t;
        }

        super.move(p);
    }

    rightDown() {
        G.selectionCursor.units.forEach(unit => {
            unit.goto(this);

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

            this.sentUnits = true;
        });
    }

}
