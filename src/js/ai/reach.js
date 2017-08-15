class Reach extends Behavior {

    constructor(target) {
        super();
        this.target = target;
    }

    attach(unit) {
        super.attach(unit);

        if (!this.path) {
            this.target = W.firstFreePositionsAround(
                this.target,
                W.cyclables
                    .filter(c => c.team)
                    .filter(c => c !== this.unit)
                    .map(c => c.behavior.reservedPosition()),
                UNIT_RADIUS
            ).sort((a, b) => {
                const visibleFromA = W.castRay(a, atan2(this.target.y - a.y, this.target.x - a.x), GRID_SIZE * 10) >= dist(a, this.target);
                const visibleFromB = W.castRay(a, atan2(this.target.y - b.y, this.target.x - b.x), GRID_SIZE * 10) >= dist(b, this.target);

                if (visibleFromA != visibleFromB) {
                    return visibleFromA ? -1 : 1;
                }

                // Both positions can see the target, so let's just pick whichever one is closer
                return dist(a, this.target) - dist(b, this.target);
            })[0];

            this.path = W.findPath(this.unit, this.target, position => {
                return dist(position, this.target) <= GRID_SIZE;
            }) || [];
        }
    }

    cycle(e) {
        super.cycle(e);

        const nextPosition = this.path[0];
        if (nextPosition) {
            const distance = dist(this.unit, nextPosition);

            this.unit.moving = true;

            if (distance > 0) {
                this.unit.angle = atan2(nextPosition.y - this.unit.y, nextPosition.x - this.unit.x);

                const appliedDistance = min(distance, UNIT_SPEED * e);

                this.unit.x += appliedDistance * cos(this.unit.angle);
                this.unit.y += appliedDistance * sin(this.unit.angle);
            } else {
                this.path.shift();
            }
        }
    }

    reconsider() {
        return this.path.length ? this : new Idle();
    }

    render() {
        if (DEBUG) {
            super.render();
        }

        R.globalAlpha = 0.1;
        beginPath();
        R.strokeStyle = this.unit.team.body;
        R.lineWidth = 4;
        moveTo(this.unit.x, this.unit.y);
        this.path.forEach(step => lineTo(step.x, step.y));
        stroke();
    }

    reservedPosition() {
        const last = this.path[this.path.length - 1] || this.target;
        return {'x': last.x, 'y': last.y};
    }

}
