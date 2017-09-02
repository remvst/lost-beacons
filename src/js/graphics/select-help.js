class SelectHelp {

    constructor(callback) {
        this.cursor = new FakeCursor();
        this.selectionAlpha = 1;
        this.alpha = 0;

        interp(this, 'alpha', 0, 1, 0.2, 0, null, () => {
            interp(this.cursor, 'x', 0, SELECT_HELP_SIZE, 1, 1);
            interp(this.cursor, 'y', 0, SELECT_HELP_SIZE, 1, 1, null, () => {
                interp(this, 'selectionAlpha', 1, 0, 0.1, 0.2, null, () => {
                    interp(this, 'alpha', 1, 0, 0.2, 0.5, null, () => {
                        delayed(callback, 2000);
                    });
                });
            });
        });
    }

    postRender() {
        R.globalAlpha = this.alpha;

        translate(this.x, this.y);

        wrap(() => this.cursor.postRender());

        R.globalAlpha *= this.selectionAlpha;

        R.strokeStyle = '#0f0';
        R.fillStyle = 'rgba(0,255,0,0.1)';
        R.lineWidth = 1;
        fillRect(
            0,
            0,
            this.cursor.x,
            this.cursor.y
        );
        strokeRect(
            0,
            0,
            this.cursor.x,
            this.cursor.y
        );
    }

}
