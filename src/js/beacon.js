class Beacon {

    constructor() {
        // Get rid of those if theyre set externally
        this.x = 0;
        this.y = 0;

        this.team = NEUTRAL_TEAM;
    }

    cycle(e) {

    }

    render() {
        wrap(() => {
            translate(this.x, this.y);

            const s = (G.t % REACH_CURSOR_PERIOD) / REACH_CURSOR_PERIOD;

            R.fillStyle = R.strokeStyle = this.team.head;
            beginPath();
            arc(0, 0, BEACON_CENTER_RADIUS * s, 0, PI * 2, true);
            fill();

            R.globalAlpha = 1 - s;
            beginPath();
            arc(0, 0, BEACON_CENTER_RADIUS, 0, PI * 2, true);
            fill();

            // R.globalAlpha = 0.5;
            // R.strokeStyle = this.team.body;
            // beginPath();
            // arc(0, 0, BEACON_CENTER_RADIUS + 5, 0, PI / 3, false);
            // stroke();

            R.globalAlpha = 0.5;

            [
                -G.t * PI * 2,
                -G.t * PI * 2 + PI
            ].forEach(angle => this.drawArc(angle, BEACON_ARC_RADIUS));

            [
                G.t * PI * 3,
                G.t * PI * 3 + PI
            ].forEach(angle => this.drawArc(angle, BEACON_ARC_RADIUS + 2));

            const s2 =  (G.t % 1) / 1;
            R.lineWidth = 2;
            R.globalAlpha = s2;
            beginPath();
            arc(0, 0, 80 * (1 - s2), 0, PI * 2, true);
            stroke();
        });
    }

    drawArc(angle, radius) {
        wrap(() => {
            rotate(angle);

            beginPath();
            arc(0, 0, radius, 0, PI / 3, false);
            stroke();
        });
    }

}
