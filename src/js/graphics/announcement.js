class Announcement {

    constructor(labels, callback) {
        this.labels = [0].concat(labels); // add one value at the beginning because of the shift
        this.callback = callback;

        interp(this, 'rectangleHeight', 0, 100, 0.25, t, null, () => this.nextLabel());
    }

    nextLabel() {
        this.labels.shift();

        if (!this.labels.length) {
            interp(this, 'rectangleHeight', 100, 0, 0.25, 0, null, this.callback);
        } else {
            interp(this, 'textXOffset', 0, CANVAS_WIDTH, 0.5, 2.5, easeInQuint, () => this.nextLabel());
            interp(this, 'textXOffset', -CANVAS_WIDTH, 0, 0.5, 0, easeOutQuint);
        }
    }

    postRender() {
        wrap(() => {
            translate(V.x, V.y);

            R.fillStyle = '#fff';
            fr(0, (CANVAS_HEIGHT - this.rectangleHeight) / 2, CANVAS_WIDTH, this.rectangleHeight);

            drawCenteredText(this.labels[0] || '', CANVAS_WIDTH / 2 + this.textXOffset, (CANVAS_HEIGHT - ANNOUNCEMENT_CELL_SIZE * 5) / 2, ANNOUNCEMENT_CELL_SIZE, '#000');
        });
    }

}
