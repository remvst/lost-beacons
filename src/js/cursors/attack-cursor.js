class AttackCursor extends Cursor {

    get color() {
        return '#900';
    }

    postRender() {
        const s = 1 - (G.t % ATTACK_CURSOR_PERIOD) / ATTACK_CURSOR_PERIOD;

        translate(this.x, this.y);

        const corner = a => () => {
            translate(cos(a) * ATTACK_CURSOR_RADIUS, sin(a) * ATTACK_CURSOR_RADIUS);
            rotate(a);
            // fillRect(0, 0, ATTACK_CURSOR_THICKNESS, ATTACK_CURSOR_SIZE);
            // fillRect(0, 0, ATTACK_CURSOR_SIZE, ATTACK_CURSOR_THICKNESS);

            beginPath();
            moveTo(-ATTACK_CURSOR_SIZE, 0);
            lineTo(0, ATTACK_CURSOR_SIZE);
            lineTo(0, -ATTACK_CURSOR_SIZE);
            fill();
        };

        R.strokeStyle = R.fillStyle = this.color;

        wrap(() => {
            R.globalAlpha = s;
            scale(s, s);
            let i = 4;
            while (i--) {
                wrap(corner((i / 4) * PI * 2 + PI / 4));
            }
        });

        const a = -PI / 3;
        const r1 = 30;
        const r2 = 60;
        const r3 = 30;

        R.lineWidth = 2;
        beginPath();
        moveTo(cos(a) * r1, sin(a) * r1);
        lineTo(cos(a) * r2, sin(a) * r2);
        lineTo(cos(a) * r2 + r3, sin(a) * r2);
        stroke();

        R.font = 'bold 10pt Courier New';
        R.textBaseline = 'middle';
        R.shadowColor = '#000';
        R.shadowOffsetY = 1;
        fillText('ATTACK()', cos(a) * r2 + r3 + 10, sin(a) * r2);
    }

    follow(target) {
        this.x = target.x;
        this.y = target.y;
    }

}
