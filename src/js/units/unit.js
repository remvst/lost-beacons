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
        // TODO
        const target = this.path[0];
        if (target) {
            const distance = dist(this, target);

            if (distance > 0) {
                const angle = Math.atan2(target.y - this.y, target.x - this.x);

                const angleDiff = normalizeAngle(angle - this.angle);
                const maxAngleDiff = normalizeAngle(UNIT_ANGULAR_SPEED * e);

                const appliedAngleDiff = between(-maxAngleDiff, angleDiff, -maxAngleDiff);
                this.angle += appliedAngleDiff;

                this.angle = angle;

                    const maxDistance = UNIT_SPEED * e;

                    this.x += Math.min(distance, maxDistance) * Math.cos(angle);
                    this.y += Math.min(distance, maxDistance) * Math.sin(angle);
            } else {
                this.path.shift();
            }

            // if (Math.abs(appliedAngleDiff) < 0.2) {
            // }
        }

    }

    render() {
        R.save();
        R.translate(this.x, this.y);
        R.rotate(this.angle);
        R.fillStyle = this.color;
        R.fillRect(-15, -10, 30, 20);
        R.restore();
    }

    goto(pt) {
        this.path = W.findPath(this, pt) || this.path;
    }

}
