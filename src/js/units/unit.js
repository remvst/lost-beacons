class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        this.x = 0;
        this.y = 0;
        this.team = PLAYER_TEAM;
        this.target = null;

        this.path = [];

        this.angle = 0;
        this.moving = false;

        this.setBehavior(new Idle());
    }

    closestVisibleTarget() {
        return W.cyclables
            .filter(c => c.team && c.team != this.team)
            .filter(c => dist(c, this) < UNIT_ATTACK_RADIUS)
            .filter(c => !W.hasObstacleBetween(this, c))
            .sort((a, b) => dist(this, a) - dist(this, b))[0];
    }

    cycle(e) {
        this.behavior.cycle(e);
    }

    render() {
        this.behavior.render();

        R.globalAlpha = 1;

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

        R.translate(-pxSize * 1.5, -pxSize * 2.5);

        // Legs
        R.save();
        R.translate(pxSize, 0);
        R.scale(sin, 1);
        R.fillStyle = this.team.leg;
        R.fillRect(0, pxSize, pxSize * 3, pxSize); // left
        R.fillRect(0, pxSize * 3, -pxSize * 3, pxSize); // right
        R.restore();

        // Left arm
        R.save();
        R.translate(offset, 0);
        R.fillStyle = this.team.body;
        R.fillRect(pxSize, 0, pxSize * 2, pxSize);
        R.fillStyle = this.team.leg;
        R.fillRect(pxSize * 2, pxSize, pxSize * 2, pxSize);
        R.restore();

        // Right arm
        R.save();
        R.translate(-offset, 0);
        R.fillStyle = this.team.body;
        R.fillRect(pxSize, pxSize * 4, pxSize * 2, pxSize);
        R.fillStyle = this.team.leg;
        R.fillRect(pxSize * 2, pxSize * 3, pxSize * 2, pxSize);
        R.restore();

        // Main body
        R.fillStyle = this.team.body;
        R.fillRect(0, pxSize, pxSize * 2, pxSize * 3);

        // Gun
        R.fillStyle = '#000';
        R.fillRect(pxSize * 3, pxSize * 2, pxSize * 3, pxSize);

        // Head
        R.fillStyle = this.team.head;
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
            this.setBehavior(new FollowPath(path));
            return true;
        }
    }

    setBehavior(b) {
        b.unit = this;
        b.nextReconsideration = 1; // yolo
        this.behavior = b;
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
