class World {

    constructor() {
        W = this;

        W.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        W.polygons = [];

        // TODO maybe use reduce?
        W.map.forEach((r, row) => {
            r.forEach((e, col) => {
                if (e) {
                    W.polygons = W.polygons.concat(cube(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE, '#158'));
                }
            });
        });

        // Filter out polygons that are pretty much the same
        W.polygons = W.polygons.filter(a => {
            return !W.polygons.filter(b => a !== b && a.isSame(b)).length
        });
    }

    render() {
        R.fillStyle = '#0e3b54';
        R.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        R.save();
        R.translate(-V.x, -V.y);

        R.fillStyle = GRID_COLOR;
        for (let x = round(V.x, GRID_SIZE) ; x < V.x + CANVAS_WIDTH ; x += GRID_SIZE) {
            R.fillRect(x, V.y, 1, CANVAS_HEIGHT);
        }
        for (let y = round(V.y, GRID_SIZE) ; y < V.y + CANVAS_HEIGHT ; y += GRID_SIZE) {
            R.fillRect(V.x, y, CANVAS_WIDTH, 1);
        }

        // TODO draw elements

        W.polygons.filter(function(p) {
            if (Math.abs(p.center.x - V.center.x) > CANVAS_WIDTH / 2 + GRID_SIZE / 2 ||
                Math.abs(p.center.y - V.center.y) > CANVAS_HEIGHT / 2 + GRID_SIZE / 2) {
                return false;
            }
            return p.renderCondition(V.center);
        }).sort((a, b) => {
            return dist(b.center, V.center) - dist(a.center, V.center);
        }).forEach(p => p.render());

        R.restore();
    }

}
