class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        this.x = 0;
        this.y = 0;
        this.team = PLAYER_TEAM;

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
        this.moving = false;
        this.behavior.cycle(e);
    }

    render() {
        this.behavior.render();

        R.globalAlpha = 1;

        save();
        translate(this.x, this.y);
        rotate(this.angle);

        const pxSize = 5;
        const amplitude = pxSize / 2;
        let sin = Math.sin(G.t * Math.PI * 2 * 2);
        if (!this.moving) {
            sin = 0;
        }

        var offset = sin * amplitude;

        translate(-pxSize * 1.5, -pxSize * 2.5);

        // Legs
        save();
        translate(pxSize, 0);
        scale(sin, 1);
        R.fillStyle = this.team.leg;
        fillRect(0, pxSize, pxSize * 3, pxSize); // left
        fillRect(0, pxSize * 3, -pxSize * 3, pxSize); // right
        restore();

        // Left arm
        save();
        translate(offset, 0);
        R.fillStyle = this.team.body;
        fillRect(pxSize, 0, pxSize * 2, pxSize);
        R.fillStyle = this.team.leg;
        fillRect(pxSize * 2, pxSize, pxSize * 2, pxSize);
        restore();

        // Right arm
        save();
        translate(-offset, 0);
        R.fillStyle = this.team.body;
        fillRect(pxSize, pxSize * 4, pxSize * 2, pxSize);
        R.fillStyle = this.team.leg;
        fillRect(pxSize * 2, pxSize * 3, pxSize * 2, pxSize);
        restore();

        // Main body
        R.fillStyle = this.team.body;
        fillRect(0, pxSize, pxSize * 2, pxSize * 3);

        // Gun
        R.fillStyle = '#000';
        fillRect(pxSize * 3, pxSize * 2, pxSize * 3, pxSize);

        // Head
        R.fillStyle = this.team.head;
        fillRect(pxSize, pxSize, pxSize * 2, pxSize * 3);

        restore();
    }

    goto(pt) {
        this.setBehavior(new Reach(pt));
    }

    setBehavior(b) {
        this.behavior = b;
        b.attach(this);
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
