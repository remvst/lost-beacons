class Indicator {

    constructor(target, label, color) {
        this.target = target;
        this.label = label;
        this.color = color;
    }

    postRender() {
        const position = this.position();

        if (
            isBetween(V.x, this.target.x, V.x + CANVAS_WIDTH) &&
            isBetween(V.y, this.target.y, V.y + CANVAS_HEIGHT)
        ) {
            return;
        }

        translate(position.x, position.y);

        drawCenteredText(R, this.label, 0, 0, 2, this.color(), true);

        const angle = angleBetween(position, this.target);
        const cells = requiredCells(this.label);

        translate(
            between(
                -cells * INDICATOR_LABEL_CELL_SIZE / 2 - INDICATOR_PADDING,
                cos(angle) * 50,
                cells * INDICATOR_LABEL_CELL_SIZE / 2 + INDICATOR_PADDING
            ),
            between(
                -5 * INDICATOR_LABEL_CELL_SIZE / 2 - INDICATOR_PADDING,
                sin(angle) * 50,
                5 * INDICATOR_LABEL_CELL_SIZE / 2 + INDICATOR_PADDING
            ) + 2.5 * INDICATOR_LABEL_CELL_SIZE
        );
        rotate(angle);

        R.fillStyle = this.color();
        // fillRect(0, 0, 10, 10);
        beginPath();
        moveTo(0, 0);
        lineTo(-INDICATOR_ARROW_SIZE, -INDICATOR_ARROW_SIZE);
        lineTo(-INDICATOR_ARROW_SIZE, INDICATOR_ARROW_SIZE);
        fill();
    }

    position() {
        return {
            'x': between(V.x + INDICATOR_MARGIN, this.target.x, V.x + CANVAS_WIDTH - INDICATOR_MARGIN),
            'y': between(V.y + INDICATOR_MARGIN, this.target.y, V.y + CANVAS_HEIGHT - INDICATOR_MARGIN)
        };
    }

}
