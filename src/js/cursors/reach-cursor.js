class ReachCursor extends Cursor {

    get color() {
        return '#0f0';
    }

    postRender() {
        const s = (G.t % REACH_CURSOR_PERIOD) / REACH_CURSOR_PERIOD;

        translate(this.x, this.y);

        this.renderLabel(nomangle('REACH()'));

        R.fillStyle = this.color;
        R.globalAlpha = 1 - s;

        beginPath();
        arc(0, 0, s * REACH_CURSOR_RADIUS, 0, PI * 2, true);
        fill();
    }

    track(target) {
        this.x = target.x;
        this.y = target.y;
    }

}
