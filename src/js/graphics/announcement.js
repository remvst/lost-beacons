class Announcement {

    constructor(label, callback) {
        this.label = label;

        interp(this, 'rectangleHeight', 100, 0, 0.25, 4, null, callback);
        interp(this, 'rectangleHeight', 0, 100, 0.25);

        interp(this, 'textXOffset', 0, CANVAS_WIDTH, 0.5, 3.5, easeInQuint);
        interp(this, 'textXOffset', -CANVAS_WIDTH, 0, 0.5, 0.25, easeOutQuint);
    }

    postRender() {
        wrap(() => {
            translate(V.x, V.y);

            R.fillStyle = '#fff';
            fillRect(0, (CANVAS_HEIGHT - this.rectangleHeight) / 2, CANVAS_WIDTH, this.rectangleHeight);

            drawCenteredText(R, this.label, CANVAS_WIDTH / 2 + this.textXOffset, (CANVAS_HEIGHT - ANNOUNCEMENT_CELL_SIZE * 5) / 2, ANNOUNCEMENT_CELL_SIZE, '#000');
        });
    }

}
