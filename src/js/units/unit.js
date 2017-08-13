class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        this.x = 0;
        this.y = 0;
        this.color = '#4c2';

        this.path = [];

        this.angle = 0;
    }

    cycle(e) {
        const target = this.path[0];
        if (target) {
            const distance = dist(this, target);

            if (distance > 0) {
                this.angle = Math.atan2(target.y - this.y, target.x - this.x);

                const appliedDistance = Math.min(distance, UNIT_SPEED * e);

                this.x += appliedDistance * Math.cos(this.angle);
                this.y += appliedDistance * Math.sin(this.angle);
            } else {
                this.path.shift();
            }
        }

    }

    render() {
        R.save();
        R.translate(this.x, this.y);
        R.rotate(this.angle);
        R.fillStyle = G.selectedUnits.indexOf(this) >= 0 ? 'red' : this.color;
        R.fillRect(-15, -10, 30, 20);
        R.restore();

        const cast = W.castRay(this, this.angle);
        if (cast) {
            R.beginPath();
            R.lineStyle = 'red';
            R.moveTo(this.x, this.y);
            R.lineTo(cast.x, cast.y);
            R.stroke();
        }
    }

    goto(pt) {
        this.path = W.findPath(this, pt, position => {
            return dist(position, pt) <= GRID_SIZE
        }) || this.path;
    }

    gotoShootable(pt) {
        this.path = W.findPath(this, pt, position => {
            if (dist(position, pt) > GRID_SIZE * 4) {
                return; // too far, no need to cast a ray
            }

            const angle = Math.atan2(pt.y - position.y, pt.x - position.x);
            const cast = W.castRay(position, angle, GRID_SIZE * 4);

            return dist(cast, position) > dist(pt, position);
        }) || [];

        console.log(this.path);
    }

}
