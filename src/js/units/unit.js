class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        this.x = 0;
        this.y = 0;
        this.color = '#4c2';

        this.path = [];
    }

    cycle(e) {
        // TODO
        const target = this.path[0];
        if (target) {
            const distance = dist(this, target);
            const angle = Math.atan2(target.y - this.y, target.x - this.x);
            const maxDistance = UNIT_SPEED * e;

            this.x += Math.min(distance, maxDistance) * Math.cos(angle);
            this.y += Math.min(distance, maxDistance) * Math.sin(angle);

            if (distance <= 0) {
                this.path.shift();
            }
        }

    }

    render() {
        R.save();
        R.translate(this.x, this.y);
        R.fillStyle = this.color;
        R.fillRect(-10, -10, 20, 20);
        R.restore();
    }

    goto(pt) {
        this.path = W.findPath(this, pt) || this.path;
    }

}
