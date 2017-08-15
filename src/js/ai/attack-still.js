class AttackStill extends Behavior {

    constructor(target) {
        super();
        this.target = target;
        this.nextShot = rand(0.2, 1);
    }

    cycle(e) {
        super.cycle(e);
        this.unit.angle = angleBetween(this.unit, this.target);

        // Shoot
        if (
            (this.nextShot -= e) <= 0 &&
            !this.target.dead &&
            dist(this.unit, this.target) < UNIT_ATTACK_RADIUS &&
            !W.hasObstacleBetween(this.unit, this.target)
        ) {
            this.nextShot = 1;

            const impact = {'x': this.target.x, 'y': this.target.y};

            let view = {
                'alpha': 1,
                'render': () => {
                    R.globalAlpha = this.alpha;
                    R.strokeStyle = '#ff0';
                    R.lineWidth = 0.5;
                    beginPath();
                    moveTo(this.unit.x, this.unit.y);
                    lineTo(impact.x, impact.y);
                    stroke();
                }
            };
            W.add(view, RENDERABLE);

            interp(view, 'alpha', 0.5, 0, 0.1, 0, null, () => W.remove(view));

            this.target.hurt(SHOT_DAMAGE);
        }
    }

    reconsider() {
        if (
            !this.target.dead &&
            dist(this.unit, this.target) < UNIT_ATTACK_RADIUS &&
            !W.hasObstacleBetween(this.unit, this.target)
        ) {
            // Target is still visible, keep attacking it
            return this;
        }

        const target = this.unit.closestVisibleTarget();

        return target ? new AttackStill(target) : new Idle();
    }

}
