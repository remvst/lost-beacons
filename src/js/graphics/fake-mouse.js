function fakeMouse(x, y, clickType) {
    wrap(() => {
        translate(x, y);

        R.fillStyle = '#000';
        fillRect(-1, 0, 2, -40);

        R.fillStyle = '#fff';
        R.strokeStyle = '#000';

        beginPath();
        rect(-15, -20, 30, 40);
        rect(-15, -20, 15, 15);
        rect(0, -20, 15, 15);

        fill();
        stroke();

        if (G.t % CLICK_HIGHLIGHT_PERIOD > CLICK_HIGHLIGHT_PERIOD / 2) {
            R.fillStyle = '#f00';
            beginPath();

            if (clickType == LEFT_CLICK) {
                rect(-15, -20, 15, 15);
            } else {
                rect(0, -20, 15, 15);
            }

            fill();
            stroke();
        }
    });
}
