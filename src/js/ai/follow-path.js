class FollowPath extends Behavior {

    constructor(path) {
        super();
        this.path = path;
    }

    cycle(e) {
        const nextPosition = this.path[0];
        if (nextPosition) {
            const distance = dist(this.unit, nextPosition);

            this.unit.moving = distance > 0;

            if (distance > 0) {
                this.unit.angle = Math.atan2(nextPosition.y - this.unit.y, nextPosition.x - this.unit.x);

                const appliedDistance = Math.min(distance, UNIT_SPEED * e);

                this.unit.x += appliedDistance * Math.cos(this.unit.angle);
                this.unit.y += appliedDistance * Math.sin(this.unit.angle);
            } else {
                this.path.shift();
            }
        }
    }

    reconsider() {
        return this.path.length ? new Idle() : this;
    }

    render() {
        R.globalAlpha = 0.1;
        R.beginPath();
        R.strokeStyle = this.unit.team.body;
        R.lineWidth = 4;
        R.moveTo(this.unit.x, this.unit.y);
        this.path.forEach(step => R.lineTo(step.x, step.y));
        R.stroke();
    }
}
