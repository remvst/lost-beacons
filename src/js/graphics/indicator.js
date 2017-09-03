class Indicator {

    constructor(target) {
        this.target = target;
        // Owner will set color and label
        this.indicateDuration = 0;
    }

    indicate(label, color, duration = 4) {
        if (label != this.label) {
            this.indicateTime = G.t;
        }

        this.label = label;
        this.color = color;
        this.indicateDuration = duration;
    }

    postRender() {
        const t = G.t - (this.indicateTime || -99);
        const radius = CANVAS_WIDTH / 2 - INDICATOR_MARGIN;

        if (t > this.indicateDuration || dist(this.target, V.center) < radius) {
            return;
        }

        const angle = angleBetween(V.center, this.target);
        const cells = requiredCells(this.label);

        const labelWidth = cells * INDICATOR_LABEL_CELL_SIZE;
        const labelHeight = 5 * INDICATOR_LABEL_CELL_SIZE;

        const minX = min(V.center.x - labelWidth / 2, V.center.x - abs(cos(angle) * radius));
        const maxX = max(V.center.x + labelWidth / 2, V.center.x + abs(cos(angle) * radius));

        const minY = min(V.center.x - labelWidth / 2, V.center.y - abs(sin(angle) * radius));
        const maxY = max(V.center.y + labelWidth / 2, V.center.y + abs(sin(angle) * radius));

        const labelX = between(minX, V.center.x + cos(angle) * radius, maxX - labelWidth);
        const labelY = between(minY, V.center.y + sin(angle) * radius, maxY - labelHeight);

        let label = this.label.substr(0, ~~(t * 30));
        if ((t % 0.5) > 0.25) {
            label += '?';
        }
        drawText(label, labelX, labelY, INDICATOR_LABEL_CELL_SIZE, this.color, true);

        translate(
            V.center.x + cos(angle) * (radius + INDICATOR_ARROW_SIZE * 2),
            V.center.y + sin(angle) * (radius + INDICATOR_ARROW_SIZE * 2)
        );
        rotate(angle);

        R.fillStyle = this.color;
        beginPath();
        moveTo(0, 0);
        lineTo(-INDICATOR_ARROW_SIZE, -INDICATOR_ARROW_SIZE);
        lineTo(-INDICATOR_ARROW_SIZE, INDICATOR_ARROW_SIZE);
        fill();
    }

}
