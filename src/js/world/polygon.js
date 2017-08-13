// Returns the 2D coordinates of a 3D point
function pointCoords(pt) {
    // TODO gut these vars
    var dX = pt.x - V.center.x,
        dY = pt.y - V.center.y;
    return {
        'x': pt.x + dX / PERSPECTIVE * pt.z,
        'y': pt.y + dY / PERSPECTIVE * pt.z
    };
}

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

        this.center = {
            'x': avgProp(pts, 'x'),
            'y': avgProp(pts, 'y'),
            'z': avgProp(pts, 'z'),
        };
    }

    isSame(b) {
        // Laziness (the check could be more accurate but fuck that it's js13k)
        return this.center.x === b.center.x && this.center.y === b.center.y;
    }

    render() {
        R.fillStyle = this.color;
        R.strokeStyle = GRID_COLOR;
        R.lineWidth = 2;
        R.lineJoin = 'round';
        R.beginPath();
        this.pts.map(pointCoords).forEach((p, i) => {
            if (!i) R.moveTo(p.x, p.y);
            else R.lineTo(p.x, p.y);
        });
        R.closePath();
        R.fill();
        R.stroke();
    }

}
