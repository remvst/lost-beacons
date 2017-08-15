class AttackStill extends Behavior {

    constructor(target) {
        super();
        this.target = target;
        this.nextShot = 1;
    }

    cycle(e) {
        super.cycle(e);
        this.unit.angle = angleBetween(this.unit, this.target);

        // Shoot
        if ((this.nextShot -= e) <= 0 && !this.target.dead) {
            this.nextShot = 1;

            const d = dist(this.unit, this.target);
            const impact = W.castRay(this.unit, angleBetween(this.unit, this.target), d);

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

            // The impact was on the target, it's a hit!
            if (dist(this.unit, impact) >= d) {
                this.target.hurt(SHOT_DAMAGE);
            }
        }
    }

    reconsider() {
        if (!this.target.dead && !W.hasObstacleBetween(this.unit, this.target)) {
            // Target is still visible, keep attacking it
            return this;
        }

        const target = this.unit.closestVisibleTarget();

        return target ? new AttackStill(target) : new Idle();
    }

}
