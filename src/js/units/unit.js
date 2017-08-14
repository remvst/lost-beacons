class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        this.x = 0;
        this.y = 0;
        this.color = '#4c2';
        this.team = PLAYER_TEAM;

        this.path = [];

        this.angle = 0;
        this.moving = false;
    }

    cycle(e) {
        const target = this.path[0];
        if (target) {
            const distance = dist(this, target);

            this.moving = distance > 0;

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

        const pxSize = 5;
        const amplitude = pxSize / 2;
        let sin = Math.sin(G.t * Math.PI * 2 * 2);
        if (!this.moving) {
            sin = 0;
        }

        var offset = sin * amplitude;
        // var invertedOffset = amplitude - offset;
        var bodyColor = '#48cd25';
        var gloveColor = '#308d16';
        var headColor = '#2ffc7e';
        var legColor = '#308d16';

        R.translate(-pxSize * 1.5, -pxSize * 2.5);

        // Legs
        R.save();
        R.translate(pxSize, 0);
        R.scale(sin, 1);
        R.fillStyle = legColor;
        R.fillRect(0, pxSize, pxSize * 3, pxSize); // left
        R.fillRect(0, pxSize * 3, -pxSize * 3, pxSize); // right
        R.restore();

        // Left arm
        R.save();
        R.translate(offset, 0);
        R.fillStyle = bodyColor;
        R.fillRect(pxSize, 0, pxSize * 2, pxSize);
        R.fillStyle = gloveColor;
        R.fillRect(pxSize * 2, pxSize, pxSize * 2, pxSize);
        R.restore();

        // Right arm
        R.save();
        R.translate(-offset, 0);
        R.fillStyle = bodyColor;
        R.fillRect(pxSize, pxSize * 4, pxSize * 2, pxSize);
        R.fillStyle = gloveColor;
        R.fillRect(pxSize * 2, pxSize * 3, pxSize * 2, pxSize);
        R.restore();

        // Main body
        R.fillStyle = bodyColor;
        R.fillRect(0, pxSize, pxSize * 2, pxSize * 3);

        // Gun
        R.fillStyle = '#000';
        R.fillRect(pxSize * 3, pxSize * 2, pxSize * 3, pxSize);

        // Head
        R.fillStyle = headColor;
        R.fillRect(pxSize, pxSize, pxSize * 2, pxSize * 3);

        R.restore();
    }

    goto(pt) {
        const path = W.findPath(this, pt, position => {
            return dist(position, pt) <= GRID_SIZE / 2;
        });

        if (path) {
            path[path.length - 1] = pt;
            path.shift(); // kinda risky, but the first step is very often a step back
            this.path = path;
            return true;
        }
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
    }

}
