class Reach extends Behavior {

    constructor(target) {
        super();
        this.target = target;
    }

    attach(unit) {
        super.attach(unit);

        this.path = W.findPath(this.unit, this.target, position => {
            return dist(position, this.target) <= GRID_SIZE / 2;
        }) || [];
    }

    cycle(e) {
        const nextPosition = this.path[0];
        if (nextPosition) {
            const distance = dist(this.unit, nextPosition);

            this.unit.moving = true;

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
        beginPath();
        R.strokeStyle = this.unit.team.body;
        R.lineWidth = 4;
        moveTo(this.unit.x, this.unit.y);
        this.path.forEach(step => lineTo(step.x, step.y));
        stroke();
    }

    reservedPosition() {
        const last = this.path[this.path.length - 1];
        return {'x': last.x, 'y': last.y};
    }

}
