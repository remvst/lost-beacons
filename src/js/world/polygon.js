function avgProp(array, property) {
    return array.reduce((t, e) => {
        return t + e[property];
    }, 0) / array.length;
}

class Polygon {

    constructor(pts, color, renderCondition) {
        this.pts = pts;
        this.color = color;
        this.renderCondition = renderCondition;
        this.alpha = 1;

        this.center = {
            'x': avgProp(pts, 'x'),
            'y': avgProp(pts, 'y'),
            'z': avgProp(pts, 'z'),
        };

        this.perspective = PERSPECTIVE;
    }

    // Returns the 2D coordinates of a 3D point
    pointCoords(pt) {
        return {
            'x': pt.x + (pt.x - V.center.x) / this.perspective * pt.z,
            'y': pt.y + (pt.y - V.center.y) / this.perspective * pt.z
        };
    }

    hash() {
        return this.center.x + ',' + this.center.y;
    }

    render() {
        wrap(() => {
            R.globalAlpha = this.alpha;
            R.fillStyle = this.color;
            R.strokeStyle = GRID_COLOR;
            R.lineWidth = 2;
            R.lineJoin = 'round';
            beginPath();
            this.pts.map(p => this.pointCoords(p)).forEach((p, i) => {
                if (!i) moveTo(p.x, p.y);
                else lineTo(p.x, p.y);
            });
            closePath();
            fill();
            stroke();
        });
    }

}
