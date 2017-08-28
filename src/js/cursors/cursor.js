class Cursor {

    constructor() {
        // Might be able to get rid of that if it's set from the outside
        // this.x = 0;
        // this.y = 0;
    }

    postRender() {
        // implement in subclasses
    }

    get color() {
        // implement in subclasses
    }

    down(p) {
        this.downPosition = p;
    }

    rightDown() {

    }

    move(p) {
        this.x = p.x;
        this.y = p.y;

        if (this.downPosition) {
            G.cursor = G.selectionCursor;
            G.cursor.down(this.downPosition);
            G.cursor.move(this);

            this.downPosition = null;
        }
    }

    up() {
        this.downPosition = null;
    }

    renderLabel(s) {
        function sign(x) {
            return x > 0 ? 1 : x < 0 ? - 1 : 0;
        }

        const center = V.center;
        let a = -PI / 3;

        if (center.x < this.x) {
            a = -PI / 2 - PI / 6;
        } else {
            a = -PI / 3;
        }

        if (center.y > this.y) {
            a *= -1;
        }

        const angleCos = cos(a);

        const r1 = 30;
        const r2 = 60;
        const r3 = 30;

        R.lineWidth = 2;
        R.strokeStyle = R.fillStyle = this.color;
        R.font = 'bold 10pt Courier New';
        R.textAlign = angleCos > 0 ? 'left' : 'right';
        R.textBaseline = 'middle';
        R.shadowColor = '#000';
        R.shadowOffsetY = 1;

        beginPath();
        moveTo(angleCos * r1, sin(a) * r1);
        lineTo(angleCos * r2, sin(a) * r2);
        lineTo(angleCos * r2 + sign(angleCos) * r3, sin(a) * r2);
        stroke();

        fillText(s, angleCos * r2 + sign(angleCos) * (r3 + 10), sin(a) * r2);
    }
}
